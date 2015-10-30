
var rotorsData = {
  "I": {
    "wires": "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "notch": "Q"
  },
  "II": {
    "wires": "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "notch": "E"
  },
  "III": {
    "wires": "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    "notch": "V"
  },
  "IV": {
    "wires": "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    "notch": "J"
  },
  "V": {
    "wires": "VZBRGITYUPSDNHLXAWMJQOFECK",
    "notch": "Z"
  }
}

Rotor.rotors = {}
for(rotorName in rotorsData){
  Rotor.rotors[rotorName] = new Rotor(rotorName,
                                      rotorsData[rotorName]["wires"],
                                      rotorsData[rotorName]["notch"]);   
}
  
  
function Rotor(name, wiringTable, notchChar, startChar, ringChar){
  "use strict";
  /** Numbers are between 0-25 (A-Z) */
  Rotor.charToNumber = function(char){
    if(char == undefined){
      return undefined;
    }
    char = String.toUpperCase(char);
    return (char.charCodeAt(0) - "A".charCodeAt(0));  
  }
  
  Rotor.numberToChar = function(number){
    if(number == undefined){
      return undefined;
    }
    return String.fromCharCode(number + "A".charCodeAt(0));  
  }
  
  Rotor.getRotors = function(){
    return Rotor.rotors;
  }

  Rotor.log = function(rotor, message){
    console.log("[Rotor]["+rotor.getName()+"] "
                + message
                + ".");
  }
  
  Rotor.error = function(rotor, message, abort){
    var fullMessage = "[Rotor]["+rotor.getName()+"] "
                + message
                + ".";
    abort = abort || false;
    if(abort){
      throw fullMessage;
    }
    console.error(fullMessage);
  }
  
  this.name = name;
  this.wiringTable = new Table(wiringTable);
  this.movableTable = new Table("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  this.contactTable = new Table("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  this.current = Rotor.charToNumber(startChar) || 0;
  this.ring = Rotor.charToNumber(ringChar) || 0;
  this.notch = Rotor.charToNumber(notchChar);
  
  // The first char of movable is the char on the little window
  this.contactTable.rotateRight(this.ring);
  this.movableTable.rotateLeft(this.current);
  this.contactTable.rotateLeft(this.current);   
  
  this.processIn = function(cinput){
    var coutput, ninput, ncontact, nrandom, npos;
    if(typeof cinput != "string"){
      Rotor.error(this,
       "can't process with a non-string input '"+cinput+"'", true);  
    }
    else if(cinput.length != 1){
      Rotor.error(this, "can't process with a cinput.length != 1", true);
    }
    Rotor.log(this, "begin processIn for '"+cinput+"'");
    ninput = Rotor.charToNumber(cinput); // An
    ncontact = this.contactTable.getNumber(ninput); // Tn
    nrandom = this.getNrandom(ncontact); // Pn
    npos = this.contactTable.getPosFromNumber(nrandom); // Wn
    coutput = Rotor.numberToChar(npos); // 
    Rotor.log(this, "end processIn for '"+cinput+"' and product '"+coutput+"'"); 
    return coutput; 
  }

this.processOut = function(cinput){
    var coutput, ninput, ncontact, nrandom, npos;
    if(typeof cinput != "string"){
      Rotor.error(this,
       "can't process with a non-string input '"+cinput+"'", true);  
    }
    else if(cinput.length != 1){
      Rotor.error(this, "can't process with a cinput.length != 1", true);
    }
    Rotor.log(this, "begin processOut for '"+cinput+"'");
    ninput = Rotor.charToNumber(cinput); // An
    ncontact = this.contactTable.getNumber(ninput); // Tn
    nrandom = this.getCunrandom(ncontact); // Pn
    npos = this.contactTable.getPosFromNumber(nrandom); // Wn
    coutput = Rotor.numberToChar(npos); // 
    Rotor.log(this, "end processOut for '"+cinput+"' and product '"+coutput+"'"); 
    return coutput; 
  }


  this.getNrandom = function(number){
    return Rotor.charToNumber(this.wiringTableAt(number)); 
  }
  
  this.getCunrandom = function(number){
    for(var i=0;i<this.wiringTable.getSize();i++){
      if(this.wiringTable.getChar(i) == Rotor.numberToChar(number)){
        return i; 
      }
    }
    return undefined;
  }
  
  this.wiringTableAt = function(number){
    return wiringTable[number];
  }
  
  this.getName = function(){
    return name;
  }
}

/*
var input = "L";
var rotors = Rotor.getRotors();
console.log(rotors["I"].process(input));
rotors["II"].process(input);
rotors["III"].process(input);
console.log(rotors);
*/



