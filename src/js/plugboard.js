function Plugboard(max){
  "use strict";
  
  Plugboard.log = function(message){
    if(LOG_ENIGMA){
      console.log("[Plugboard] "
                  + message
                  + ".");      
    }
  }
  
  this.MAX = max || 10;
  this.combMap= {};
  
  this.plug = function(char){
    char = this.std(char);
    var value;
    if(this.combMap[char] == undefined){
      value = char;
    }else{
      value = this.combMap[char];
    }
    Plugboard.log("plug "+char+" & get "+value);
    return value;
  }
  
  this.add = function(charIn, charOut){
    charIn = this.std(charIn);
    charOut = this.std(charOut);
    Plugboard.log("add "+charIn+" | " + charOut);
    if(this.combMap.length == 10){
      throw "Can't plug more than "+this.MAX+" combinaitions.";
    }
    this.combMap[charIn] = charOut;
    this.combMap[charOut] = charIn;    
  }
  
  this.delete = function(charIn, charOut){
    charIn = this.std(charIn);
    charOut = this.std(charOut);
    Plugboard.log("delete "+charIn+" | " + charOut);
    delete this.combMap[charIn];
    delete this.combMap[charOut];
  }
  
  this.combToStr = function(charIn, charOut){
    charIn = this.std(charIn);
    charOut = this.std(charOut);
    return charIn + " | " + this.combMap[charIn];
  }
  
  this.used = function(char){
    char = this.std(char);
    return this.combMap[char] != undefined;
  }
  
  this.getMaxCable = function(){
    return this.MAX;
  }

  this.std = function(char){
    return char.toUpperCase();
  }

}
/*
var pb = new Plugboard(2);
console.log(pb.getMaxCable());
console.log(pb.combMap);
console.log(pb.plug("A"));
console.log(pb.plug("B"));
console.log(pb.used("A"));
pb.add("A", "B");
console.log(pb.combMap);
console.log(pb.plug("A"));
console.log(pb.plug("B"));
console.log(pb.used("A"));
console.log(pb.combToStr("B"));
*/
