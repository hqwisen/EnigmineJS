
function Machine(){
  "use strict";

  this.rotors = {};
  this.rotors["I"] = RotorFactory.createRomanOne();
  this.rotors["II"] = RotorFactory.createRomanTwo();
  this.rotors["III"] = RotorFactory.createRomanThree();
  this.rotors["IV"] = RotorFactory.createRomanFour();
  this.rotors["V"] = RotorFactory.createRomanFive();

  this.reflectors = {};
  this.reflectors["B"] = RotorFactory.createReflectorB();
  this.reflectors["C"] = RotorFactory.createReflectorC();

}

Machine.RIGHT_ROTOR = 2;
Machine.MIDDLE_ROTOR = 1;
Machine.LEFT_ROTOR = 0;

Machine.prototype.getRotors = function(){
  return this.rotors;
}

Machine.prototype.getRotor = function(name){
  return this.rotors[name];
}

Machine.prototype.getReflectors = function(){
  return this.reflectors;
}

Machine.prototype.getReflector = function(name){
  return this.reflectors[name];
}
