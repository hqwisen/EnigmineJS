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

  this.getSize = function(){
    return this.chars.length;
  }
  
}
