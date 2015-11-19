
var reflectorsData = 
{
  "B":{
    "wires":"YRUHQSLDPXNGOKMIEBFZCWVJAT"
  },
  "C":{
    "wires":"FVPJIAOYEDRZXWGCTKUQSBNMHL"
  }
}

Reflector.REFLECTORS = {}
for(var reflectorName in reflectorsData){
  Reflector.REFLECTORS[reflectorName] = new Reflector(reflectorName,
  reflectorsData[reflectorName]["wires"]);   
}

function Reflector(name, wiringTable){
  "use strict";
  Reflector.log = function(refl, message){
    if(LOG_ENIGMA){
      console.log("[Reflector]["+refl.getName()+"] "
                  + message
                  + ".");      
    }
  }
  
  Reflector.error = function(refl, message, abort){
    var fullMessage = "[Reflector]["+refl.getName()+"] "
                + message
                + ".";
    abort = abort || false;
    if(abort){
      throw fullMessage;
    }
    console.error(fullMessage);
  }

  this.wiringTable = new Table(wiringTable);
  this.process = function(cinput){
    Reflector.log(this, "begin process for '"+cinput+"'");
    var index = Rotor.charToNumber(cinput);
    var coutput =  this.wiringTable.getChar(index);
    Reflector.log(this, "end process for '"+cinput
      +"' and product '"+coutput+"'");
    return coutput;
  }

  this.getName = function(){
    return name;
  }

}
/*
console.log("> Reflector");
var input = "I";
reflectors = Reflector.getReflectors();
var output = reflectors["B"].process(input);
console.log(input+" > "+output);
*/
