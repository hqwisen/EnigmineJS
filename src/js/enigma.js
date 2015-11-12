
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


function Enigma(config, name){
  "use strict";
  Enigma.log = function(enig, message){
    console.log("[Enigma]["+enig.getName()+"] "
                + message
                + ".");
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

  this.config = config || Enigma.DEFAULT_CONFIG;
  this.name = name || "Enigma I";

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
    this.rotateRotor(Enigma.RIGHT_ROTOR);
    coutput = this.processInRotor(Enigma.RIGHT_ROTOR, cinput);
    coutput = this.processInRotor(Enigma.MIDDLE_ROTOR, coutput);
    coutput = this.processInRotor(Enigma.LEFT_ROTOR, coutput);
    coutput = this.reflect(coutput);
    coutput = this.processOutRotor(Enigma.LEFT_ROTOR, coutput);
    coutput = this.processOutRotor(Enigma.MIDDLE_ROTOR, coutput);
    coutput = this.processOutRotor(Enigma.RIGHT_ROTOR, coutput);
    Enigma.log(this, "end process for '"+cinput
      +"' and product '"+coutput+"'");
    return coutput;
  }

  this.processInRotor = function(r, cinput){
    return this.getRotor(r).processIn(cinput);
  }
  
  this.processOutRotor = function(r, cinput){
    return this.getRotor(r).processOut(cinput);
  }

  this.rotateRotor = function(r){
    this.getRotor(r).rotate();
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
  
  this.getReflector = function(){
    return Reflector.REFLECTORS[this.config["reflector"]];
  }

  this.setReflector = function(reflector){
    this.config["reflector"] = reflector;
  }
  this.reflect = function(cinput){
    return this.getReflector().process(cinput);
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


