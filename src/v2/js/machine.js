
function Machine(){
  "use strict";
  
  this.rotors = {};
  this.rotors["I"] = RotorFactory.createRomanOne();
  this.rotors["II"] = RotorFactory.createRomanTwo();
  this.rotors["III"] = RotorFactory.createRomanThree();
  this.rotors["IV"] = RotorFactory.createRomanFour();
  this.rotors["V"] = RotorFactory.createRomanFive();
  

  this.getRotors = function(){
    return this.rotors;
  }

  this.getRotor = function(name){
    return this.rotors[name];
  }
}