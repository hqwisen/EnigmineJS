
Enigma.defaultConfig = 
{
	"rotors":["I", "II", "III"],
	"reflector":"B"
}

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


	this.config = config || Enigma.defaultConfig;
	this.name = name || "Enigma I";
	
	this.process = function(cinput){
		var coutput;
		Enigma.log(this, "begin process for "+cinput);
		coutput = this.processInRotor(2, cinput);
		coutput = this.processInRotor(1, coutput);
		coutput = this.processInRotor(0, coutput);
		coutput = this.reflect(coutput);
		coutput = this.processOutRotor(0, coutput);
		coutput = this.processOutRotor(1, coutput);
		coutput = this.processOutRotor(2, coutput);
		Enigma.log(this, "end process for '"+cinput
      +"' and product '"+coutput+"'");
    
	}

	this.processInRotor = function(r, cinput){
		var name, rotor;
		name = this.config["rotors"][r];
		rotor = Rotor.getRotors()[name];
		return rotor.processIn(cinput);
	}
	
	this.processOutRotor = function(r, cinput){
		var name, rotor;
		name = this.config["rotors"][r];
		rotor = Rotor.getRotors()[name];
		return rotor.processOut(cinput);
	}
	
	this.reflect = function(cinput){
		var name, reflector;
		name = this.config["reflector"];
		reflector = Reflector.getReflectors()[name];
		return reflector.process(cinput);
	}

	this.getConfig = function(){
		return this.config;
	}

	this.getName = function(){
		return this.name;
	}
	
}

var enigma = new Enigma();
var input = "F";
enigma.process(input);


