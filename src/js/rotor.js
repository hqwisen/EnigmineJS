
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

Rotor.NAME = ["I", "II", "III", "IV", "V"];

Rotor.ROTORS = {}
for(var rotorName in rotorsData){
  Rotor.ROTORS[rotorName] = new Rotor(rotorName,
                                      rotorsData[rotorName]["wires"],
                                      rotorsData[rotorName]["notch"]);   
}
  
Rotor.MINSET = "A";
Rotor.MAXSET = "Z";
Rotor.CHARCODEMINSET = Rotor.MINSET.charCodeAt(0);
Rotor.CHARCODEMAXSET = Rotor.MAXSET.charCodeAt(0);


Rotor.fullInfo = function(char){
  return char + " - " + (Rotor.charToNumber(char)+1);
}

function Rotor(name, wiringTable, notchChar, startChar, ringChar){
  "use strict";
  /** Numbers are between 0-25 (A-Z) */
  Rotor.charToNumber = function(char){
    if(char == undefined){
      return undefined;
    }
    char = char.toUpperCase();
    return (char.charCodeAt(0) - "A".charCodeAt(0));  
  }
  
  Rotor.numberToChar = function(number){
    if(number == undefined){
      return undefined;
    }
    return String.fromCharCode(number + "A".charCodeAt(0));  
  }
  
  Rotor.log = function(rotor, message){
    if(LOG_ENIGMA){
      console.log("[Rotor]["+rotor.getName()+"] "
                  + message
                  + ".");
    }
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
  this.rhtml = undefined;
  
  this.getName = function(){
    return name;
  }

  this.getCharStart = function(){
    return Rotor.numberToChar(this.current);
  }
  
  this.getCharRing = function(){
    return Rotor.numberToChar(this.ring);
  }
  
  this.setRing = function(ring){
    Rotor.log(this, "setRing " + ring);
    if(typeof ring == "string"){
      ring = Rotor.charToNumber(ring);
    }
    if(ring > this.ring){
      this.contactTable.rotateRight(ring - this.ring);
      this.ring = ring;
    }else if(ring < this.ring){
      this.contactTable.rotateLeft(this.ring - ring);
      this.ring = ring;
    }
  }
  // TODO ambiguité entre setStart et rotation pour rotorhtml
  this.setStart = function(start){
    Rotor.log(this, "setStart " + start);
    if(typeof start == "string"){
      start = Rotor.charToNumber(start);
    }
    if(start > this.current){
      this.movableTable.rotateLeft(start - this.current);
      this.contactTable.rotateLeft(start - this.current);
      this.current = start;
    }else if(start < this.current){ 
      this.movableTable.rotateRight(this.current - start);
      this.contactTable.rotateRight(this.current - start);
      this.current = start;
    }
  }
  // The first char of movable is the char on the little window
  //this.setRing(this.ring);
  //this.setStart(this.current);
  
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
    //Rotor.log(this, "movable: "+this.movableTable.toString());
    //Rotor.log(this, "contact: "+this.contactTable.toString());
    ninput = Rotor.charToNumber(cinput);
    ncontact = this.contactTable.getNumber(ninput);
    nrandom = this.getRandom(ncontact);
    npos = this.contactTable.getPosFromNumber(nrandom);
    coutput = Rotor.numberToChar(npos); 
    Rotor.log(this, "end processIn for '"+cinput+"' and product '"+coutput+"'"); 
    return coutput; 
  }

  
  this.reverseProcessIn = function(invinput){
    var cinput, ninput, npos, nrandom, ncontact;
    if(typeof invinput != "string"){
      Rotor.error(this,
       "can't process with a non-string input '"+invinput+"'", true);  
    }
    else if(invinput.length != 1){
      Rotor.error(this, "can't process with a invinput.length != 1", true);
    }
    Rotor.log(this, "begin reverseProcessIn for '"+invinput+"'");
    npos = Rotor.charToNumber(invinput);
    nrandom = this.contactTable.getNumber(npos);
    for(var i=0;i<this.wiringTable.getSize();i++){
      if(nrandom == this.wiringTable.getNumber(i)){
        ncontact = i;
        break;
      }
    }
    for(var i=0;i<this.contactTable.getSize();i++){
      if(ncontact == this.contactTable.getNumber(i)){
        ninput = i;
        break;
      }
    }
    cinput = Rotor.numberToChar(ninput);    
    Rotor.log(this, "end reverseProcessIn for '"+invinput+"' and product '"+cinput+"'"); 
    return cinput; 
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
    ninput = Rotor.charToNumber(cinput);
    ncontact = this.contactTable.getNumber(ninput);
    nrandom = this.getInverseRandom(ncontact);
    npos = this.contactTable.getPosFromNumber(nrandom);
    coutput = Rotor.numberToChar(npos);
    Rotor.log(this, "end processOut for '"+cinput+"' and product '"+coutput+"'"); 
    return coutput; 
  }

  this.reverseProcessOut = function(invinput){
    var npos, nrandom, ncontact, ninput, cinput;
    if(typeof invinput != "string"){
      Rotor.error(this,
       "can't reverse process with a non-string input '"+invinput+"'", true);  
    }
    else if(invinput.length != 1){
      Rotor.error(this, "can't process with a invinput.length != 1", true);
    }
    Rotor.log(this, "begin reverseProcessOut for '"+invinput+"'");
    npos = Rotor.charToNumber(invinput);
    nrandom = this.contactTable.getNumber(npos);
    ncontact = this.wiringTable.getNumber(nrandom);
    for(var i=0;i<this.contactTable.getSize();i++){
      if(ncontact == this.contactTable.getNumber(i)){
        ninput = i;
        break;
      }
    }
    cinput = Rotor.numberToChar(ninput);    
    Rotor.log(this, "end reverseProcessOut for '"+invinput+"' and product '"+cinput+"'"); 
    return cinput;
  }
  
  this.rotate = function(){
    Rotor.log(this, "rotate");
    this.movableTable.rotateLeft(1);
    this.contactTable.rotateLeft(1);
    if(this.current == Rotor.charToNumber(Rotor.MAXSET)){
      this.current = 0;
    }else{
      this.current += 1;
    }
    if(this.rhtml != undefined){
      this.rhtml.refresh();
    }
  }
  
  this.reverseRotate = function(){
    Rotor.log(this, "reverseRotate");
    this.movableTable.rotateRight(1);
    this.contactTable.rotateRight(1);
    if(this.current == Rotor.charToNumber(Rotor.MINSET)){
      this.current = 25;
    }else{
      this.current -= 1;
    }
    if(this.rhtml != undefined){
      this.rhtml.refresh();
    }
  }
  
  this.setRotorHtml = function(rhtml){
    Rotor.log(this, "setRotorHtml");
    this.rhtml = rhtml;
  }
  
  this.unsetRotorHtml = function(){
    Rotor.log(this, "unsetRotorHtml");
    this.rhtml = undefined;
  }
  
  this.matchNotch = function(){
    return this.current == this.notch;
  }
  
  this.matchNotchBefore = function(){
    return this.current-1 == this.notch;
  }
  
  this.matchNotch = function(){
    return this.current == this.notch;
  }
  
  this.getRandom = function(number){
    return Rotor.charToNumber(this.wiringTableAt(number)); 
  }
  
  this.getInverseRandom = function(number){
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
}


/*var rotor = Rotor.ROTORS["II"];
rotor.setRing("Y");
rotor.setStart("F");  
console.log(rotor.matchNotch());
console.log(rotor.matchNotchBefore());*/
/*
var input = "L";
var rotors = Rotor.getRotors();
console.log(rotors["I"].process(input));
rotors["II"].process(input);
rotors["III"].process(input);
console.log(rotors);
*/



