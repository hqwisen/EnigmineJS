$(function(){
  "use strict";
  
  function MachineController(){
    
    this.machine = new Machine();
    this.rotorViewList = [];
    
    for (var name in this.machine.getRotors()){
      this.createRotorView(name);
    }

  }  
  
  MachineController.prototype.createRotorView = function(name){
    console.log("create rotor view " + name);  
  }

  
  var controller = new MachineController();

});
