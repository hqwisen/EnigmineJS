// TODO Static method outside definition
Enigma.DEFAULT_CONFIG =
{
  "rotors":["I", "II", "III"],
  "reflector":"B",
  "starts":["A", "A", "A"],
  "rings":["A", "A", "A"]
}

Enigma.RIGHT_ROTOR = 2;
Enigma.MIDDLE_ROTOR = 1;
Enigma.LEFT_ROTOR = 0;


function Enigma(config, name, maxCable){
  "use strict";
  Enigma.log = function(enig, message){
    if(LOG_ENIGMA){
      console.log("[Enigma]["+enig.getName()+"] "
                  + message
                  + ".");
    }
  }

  Enigma.error = function(enig, message, abort){
    var fullMessage = "[Enigma]["+enig.getName()+"] "
                + message
                + ".";
    abort = abort || false;
    if(abort){
      throw fullMessage;
    }
    console.error(fullMessage);
  }

  this.MAXCABLE = maxCable || 10;
  this.config = config || Enigma.DEFAULT_CONFIG;
  this.name = name || "Enigma I";
  this.plugboard = new Plugboard(this.MAXCABLE);

  this.applyConfig = function(config){
    this.setStartRotor(Enigma.RIGHT_ROTOR,
                       this.config["starts"][Enigma.RIGHT_ROTOR]);
    this.setStartRotor(Enigma.MIDDLE_ROTOR,
                       this.config["starts"][Enigma.MIDDLE_ROTOR]);
    this.setStartRotor(Enigma.LEFT_ROTOR,
                       this.config["starts"][Enigma.LEFT_ROTOR]);
    this.setRingRotor(Enigma.RIGHT_ROTOR,
                       this.config["rings"][Enigma.RIGHT_ROTOR]);
    this.setRingRotor(Enigma.MIDDLE_ROTOR,
                       this.config["rings"][Enigma.MIDDLE_ROTOR]);
    this.setRingRotor(Enigma.LEFT_ROTOR,
                       this.config["rings"][Enigma.LEFT_ROTOR]);
  }

  this.process = function(cinput){
    var coutput;
    Enigma.log(this, "begin process for "+cinput);
    cinput = this.plugboard.plug(cinput);
    if(this.matchNotchRotor(Enigma.MIDDLE_ROTOR)){
      this.rotateRotor(Enigma.MIDDLE_ROTOR);
      this.rotateRotor(Enigma.LEFT_ROTOR);
    }
    else if(this.matchNotchRotor(Enigma.RIGHT_ROTOR)){
      this.rotateRotor(Enigma.MIDDLE_ROTOR);
    }
    this.rotateRotor(Enigma.RIGHT_ROTOR);
    coutput = this.processInRotor(Enigma.RIGHT_ROTOR, cinput);
    coutput = this.processInRotor(Enigma.MIDDLE_ROTOR, coutput);
    coutput = this.processInRotor(Enigma.LEFT_ROTOR, coutput);
    coutput = this.reflect(coutput);
    coutput = this.processOutRotor(Enigma.LEFT_ROTOR, coutput);
    coutput = this.processOutRotor(Enigma.MIDDLE_ROTOR, coutput);
    coutput = this.processOutRotor(Enigma.RIGHT_ROTOR, coutput);
    coutput = this.plugboard.plug(coutput);
    Enigma.log(this, "end process for '"+cinput
      +"' and product '"+coutput+"'");
    return coutput;
  }

  this.reverseProcess = function(loop){
    loop = loop || 1;
    Enigma.log(this, "begin a "+loop+" loop reverseProcess");
    for(var i=0;i<loop;i++){
      Enigma.log(this, "begin reverseProcess");
      this.reverseRotateRotor(Enigma.RIGHT_ROTOR);
      if(this.matchNotchRotor(Enigma.RIGHT_ROTOR)){
        this.reverseRotateRotor(Enigma.MIDDLE_ROTOR);
      }else if(this.matchNotchBeforeRotor(Enigma.MIDDLE_ROTOR)){
        this.reverseRotateRotor(Enigma.MIDDLE_ROTOR);
        this.reverseRotateRotor(Enigma.LEFT_ROTOR);
      }
      Enigma.log(this, "end reverseProcess");
    }
  }

  this.processInRotor = function(r, cinput){
    return this.getRotor(r).processIn(cinput);
  }

  this.processOutRotor = function(r, cinput){
    return this.getRotor(r).processOut(cinput);
  }

  this.matchNotchRotor = function(r){
    return this.getRotor(r).matchNotch();
  }

  this.matchNotchBeforeRotor = function(r){
    return this.getRotor(r).matchNotchBefore();
  }


  this.rotateRotor = function(r){
    this.getRotor(r).rotate();
  }

  this.reverseRotateRotor = function(r){
    this.getRotor(r).reverseRotate();
  }

  this.setRingRotor = function(r, ring){
    this.config["rings"][r] = ring;
    this.getRotor(r).setRing(ring);
  }

  this.setStartRotor = function(r, start){
    this.config["starts"][r] = start;
    this.getRotor(r).setStart(start);
  }

  this.getRotor = function(r){
    return Rotor.ROTORS[this.config["rotors"][r]];
  }

  this.setRotor = function(r, rotor){
    this.config["rotors"][r] = rotor;
  }

  this.setRotorHtml = function(r, rhtml){
    this.getRotor(r).setRotorHtml(rhtml);
  }

  this.getReflector = function(){
    return Reflector.REFLECTORS[this.config["reflector"]];
  }

  this.setReflector = function(reflector){
    this.config["reflector"] = reflector;
  }
  this.reflect = function(cinput){
    return this.getReflector().process(cinput);
  }

  this.addToPlugboard = function(charIn, charOut){
    this.plugboard.add(charIn, charOut);
  }

  this.deleteToPlugboard = function(charIn, charOut){
    this.plugboard.delete(charIn, charOut);
  }

  this.plugToStr = function(charIn, charOut){
    return this.plugboard.combToStr(charIn, charOut);
  }

  this.isPlugboardUsed = function(char){
    return this.plugboard.used(char);
  }

  this.setPlugboardHtml = function(phtml){
    this.plugboard.setPlugboarHtml(phtml);
  }

  this.getConfig = function(){
    return this.config;
  }

  this.getName = function(){
    return this.name;
  }
  this.applyConfig();
}

/*var inputs = "HAKIM";
var enigma = new Enigma();
var output = "";
for(var i=0;i<inputs.length;i++){
  output+=enigma.process(inputs[i]);
}
console.log(output);*/


