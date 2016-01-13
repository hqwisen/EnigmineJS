$(function(){
  "use strict";
  
  /* HtmlHelper */
  
  function HELPER = function(){
  
    this.allRotorContainer = "rotors-container";
    this.rotorContainer = "rotor";
    this.rotorButtonContainer = "rotor-button-container";
    this.rotorParam = "rotor-param";
    this.rotorElement = "rotor-param-element";
  }
  
  
  /* RotorView */
  
  function RotorView(){
    
  }
  
  /* MachineController */
  
  function MachineController(){
    
    this.machine = new Machine();
    this.rotorViewList = [];
    
    for (var name in this.machine.getRotors()){
      this.createRotorView(name);
    }

  }  
  
  MachineController.prototype.createRotorView = function(name){
    
  }

  /* Main */
  
  function main(args){
    var controller = new MachineController();
  }
  
  main();
  
});
