function Table(chars){
  "use strict";
  this.chars = chars;
  
  this.rotateRight = function(turn){
    for(var i=0;i<turn;i++){
      this.chars = this.chars[this.chars.length-1]
                 + this.chars.slice(0, this.chars.length-1);      
    }
  }
  
  this.rotateLeft = function(turn){
    for(var i=0;i<turn;i++){    
      this.chars = this.chars.slice(1, this.chars.length)
                 + this.chars[0];
    }
  }
  
  this.getPosFromChar = function(char){
    for(var i=0;i<this.chars.length;++i){
      if(this.chars[i] == char){
        return i;
      }
    }
    return -1;
  }
  
  this.getPosFromNumber = function(number){
    return this.getPosFromChar(Rotor.numberToChar(number));
  }
  
  this.getChar = function(index){
    return this.chars[index];
  }
  
  this.getNumber = function(index){
    return Rotor.charToNumber(this.getChar(index));
  }
  
  this.toString = function(){
    return this.chars;
  }
  
}

function Rotor(name, wiringTable, startChar, ringChar, notchChar){
  "use strict";
  /** Numbers are between 0-25 (A-Z) */
  Rotor.charToNumber = function(char){
    char = String.toUpperCase(char);
    return (char.charCodeAt(0) - "A".charCodeAt(0));  
  }
  
  Rotor.numberToChar = function(number){
    return String.fromCharCode(number + "A".charCodeAt(0));  
  }
  
  Rotor.log = function(rotor, message){
    console.log("[Rotor]["+rotor.getName()+"] "
                + message
                + ".");
  }
  
  Rotor.error = function(rotor, message, abort){
    fullMessage = "[Rotor]["+rotor.getName()+"] "
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
  this.current = Rotor.charToNumber(startChar);
  this.ring = Rotor.charToNumber(ringChar);
  this.notch = Rotor.charToNumber(notchChar);
  
  this.init = function(){
    var nrot;
    // The first char of movable is the char on the little window
    /*this.movableTable.rotateLeft(this.ring);
    nrot = this.current - this.ring;
    if (nrot < 0){
      this.movableTable.rotateLeft(this.current);
      this.contactTable.rotateLeft(this.current);      
    }else{
      
    }*/
    this.contactTable.rotateRight(this.ring);
    this.movableTable.rotateLeft(this.current);
    this.contactTable.rotateLeft(this.current);
    
  }
  
  this.process = function(cinput){
    var coutput, ninput, ncontact, nrandom, npos;
    if(typeof cinput != "string"){
      Rotor.error(this, "can't process with a non-string input", true);  
    }
    else if(cinput.length != 1){
      Rotor.error(this, "can't process with a cinput.length != 1", true);
    }
    Rotor.log(this, "begin process for '"+cinput+"'");
    ninput = Rotor.charToNumber(cinput); // An
    ncontact = this.contactTable.getNumber(ninput); // Tn
    nrandom = this.random(ncontact); // Pn
    npos = this.contactTable.getPosFromNumber(nrandom); // Wn
    coutput = Rotor.numberToChar(npos); // 
    console.log(this.movableTable.toString());
    console.log(this.contactTable.toString());
    Rotor.log(this, "end process for '"+cinput+"' and product '"+coutput+"'");
    
  }

  this.random = function(number){
    return Rotor.charToNumber(this.wiringTableAt(number)); 
  }
  
  this.wiringTableAt = function(number){
    return wiringTable[number];
  }
  
  this.getName = function(){
    return name;
  }
  
  // TODO check better way
  this.init();
  
}

var rotorI = new Rotor("I", "EKMFLGDQVZNTOWYHXUSPAIBRCJ", "S", "K", "Q");
var input = "O";
rotorI.process(input);