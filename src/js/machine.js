function Machine(name, maxCable, config) {
  "use strict";

  this.name = name || "Unknown machine";
  this.maxCable = maxCable || 2;
  this.config = config || Machine.DEFAULT_CONFIG;
  this.plugboard = new Plugboard(this.maxCable);

  this.rotors = {};
  this.rotors["I"] = RotorFactory.createRomanOne();
  this.rotors["II"] = RotorFactory.createRomanTwo();
  this.rotors["III"] = RotorFactory.createRomanThree();
  this.rotors["IV"] = RotorFactory.createRomanFour();
  this.rotors["V"] = RotorFactory.createRomanFive();

  this.reflectors = {};
  this.reflectors["B"] = RotorFactory.createReflectorB();
  this.reflectors["C"] = RotorFactory.createReflectorC();
  this.applyConfig();
}

Machine.DEFAULT_CONFIG = {
  "rotors": ["I", "II", "III"],
  "reflector": "B",
  "starts": ["A", "A", "A"],
  "rings": ["A", "A", "A"]
}

Machine.RIGHT_ROTOR = 2;
Machine.MIDDLE_ROTOR = 1;
Machine.LEFT_ROTOR = 0;

Machine.log = function (enig, message) {
  if (LOG_ENIGMA) {
    console.log("[Machine][" + enig.getName() + "] " + message + ".");
  }
}

Machine.error = function (enig, message, abort) {
  var fullMessage = "[Machine][" + enig.getName() + "] " + message + ".";
  abort = abort || false;
  if (abort) {
    throw fullMessage;
  }
  console.error(fullMessage);
}


Machine.prototype.getConfig = function () {
  return this.config;
}

Machine.prototype.getName = function () {
  return this.name;
}

Machine.prototype.getRotors = function () {
  return this.rotors;
}

Machine.prototype.getRotor = function (name) {
  return this.rotors[name];
}

Machine.prototype.getReflectors = function () {
  return this.reflectors;
}

Machine.prototype.getReflector = function (name) {
  return this.reflectors[name];
}

Machine.prototype.getRotorOnSide = function (side) {
  return this.getRotor(this.config["rotors"][side]);
}

Machine.prototype.setRotorOnSide = function (side, name) {
  Machine.log(this, "set rotor on side "+side+": "+name);
  this.config["rotors"][side] = name;
}

Machine.prototype.setActiveReflector = function (name) {
  Machine.log(this, "set reflector: "+name);
  this.config["reflector"] = name;
}

Machine.prototype.getActiveReflector = function () {
  return this.getReflector(this.config["reflector"]);
}

Machine.prototype.applyConfig = function (config) {
  this.setRotorStart(Machine.RIGHT_ROTOR,
    this.config["starts"][Machine.RIGHT_ROTOR]);
  this.setRotorStart(Machine.MIDDLE_ROTOR,
    this.config["starts"][Machine.MIDDLE_ROTOR]);
  this.setRotorStart(Machine.LEFT_ROTOR,
    this.config["starts"][Machine.LEFT_ROTOR]);
  this.setRotorRing(Machine.RIGHT_ROTOR,
    this.config["rings"][Machine.RIGHT_ROTOR]);
  this.setRotorRing(Machine.MIDDLE_ROTOR,
    this.config["rings"][Machine.MIDDLE_ROTOR]);
  this.setRotorRing(Machine.LEFT_ROTOR,
    this.config["rings"][Machine.LEFT_ROTOR]);
}

Machine.prototype.crypt = function (cinput) {
  var coutput;
  Machine.log(this, "begin process for " + cinput);
  cinput = this.plugboard.plug(cinput);
  if (this.matchNotchRotor(Machine.MIDDLE_ROTOR)) {
    this.rotateRotor(Machine.MIDDLE_ROTOR);
    this.rotateRotor(Machine.LEFT_ROTOR);
  } else if (this.matchNotchRotor(Machine.RIGHT_ROTOR)) {
    this.rotateRotor(Machine.MIDDLE_ROTOR);
  }
  this.rotateRotor(Machine.RIGHT_ROTOR);
  coutput = this.processInRotor(Machine.RIGHT_ROTOR, cinput);
  coutput = this.processInRotor(Machine.MIDDLE_ROTOR, coutput);
  coutput = this.processInRotor(Machine.LEFT_ROTOR, coutput);
  coutput = this.reflect(coutput);
  coutput = this.processOutRotor(Machine.LEFT_ROTOR, coutput);
  coutput = this.processOutRotor(Machine.MIDDLE_ROTOR, coutput);
  coutput = this.processOutRotor(Machine.RIGHT_ROTOR, coutput);
  coutput = this.plugboard.plug(coutput);
  Machine.log(this, "end process for '" + cinput + "' and product '" + coutput + "'");
  return coutput;
}

Machine.prototype.reverse = function (loop) {
  loop = loop || 1;
  Machine.log(this, "begin a " + loop + " loop reverse");
  for (var i = 0; i < loop; i++) {
    Machine.log(this, "begin reverse ("+i+").");
    this.reverseRotateRotor(Machine.RIGHT_ROTOR);
    if (this.matchNotchRotor(Machine.RIGHT_ROTOR)) {
      this.reverseRotateRotor(Machine.MIDDLE_ROTOR);
    } else if (this.matchNotchBeforeRotor(Machine.MIDDLE_ROTOR)) {
      this.reverseRotateRotor(Machine.MIDDLE_ROTOR);
      this.reverseRotateRotor(Machine.LEFT_ROTOR);
    }
    Machine.log(this, "end reverse ("+i+").");
  }
}

Machine.prototype.processInRotor = function (side, cinput) {
  return this.getRotorOnSide(side).processIn(cinput);
}

Machine.prototype.processOutRotor = function (side, cinput) {
  return this.getRotorOnSide(side).processOut(cinput);
}

Machine.prototype.matchNotchRotor = function (side) {
  return this.getRotorOnSide(side).matchNotch();
}

Machine.prototype.matchNotchBeforeRotor = function (side) {
  return this.getRotorOnSide(side).matchNotchBefore();
}


Machine.prototype.rotateRotor = function (side) {
  this.getRotorOnSide(side).rotate();
}

Machine.prototype.reverseRotateRotor = function (side) {
  this.getRotorOnSide(side).reverseRotate();
}

Machine.prototype.getRotorRing = function (side) {
  return this.getRotorOnSide(side).getCharRing();
}

Machine.prototype.getRotorStart = function (side) {
  return this.getRotorOnSide(side).getCharStart();
}

Machine.prototype.setRotorRing = function (side, ring) {
  this.config["rings"][side] = ring;
  this.getRotorOnSide(side).setRing(ring);
}

Machine.prototype.setRotorStart = function (side, start) {
  this.config["starts"][side] = start;
  this.getRotorOnSide(side).setStart(start);
}

Machine.prototype.reflect = function (cinput) {
  return this.getActiveReflector().process(cinput);
}

Machine.prototype.getMaxCable = function(){
  return this.maxCable;
}

Machine.prototype.addPlugboardConnection = function (charIn, charOut) {
  this.plugboard.add(charIn, charOut);
}

Machine.prototype.removePlugboardConnection = function (charIn, charOut) {
  this.plugboard.delete(charIn, charOut);
}

Machine.prototype.isPlugboardUsed = function (char) {
  return this.plugboard.used(char);
}
