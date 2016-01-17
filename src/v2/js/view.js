$(function(){
  "use strict";

  /* ReflectorView */
  
  function changeReflectorClick(event){
    var controller = event.data.controller;
    controller.changeReflector(event.data.choice);
  }
  
  function ReflectorView(controller){
    this.controller = controller;

    $("<div/>", {class:"rotor", id:this.id("reflector")}).appendTo("#rotors-container");
    $("<span/>", {text:this.getName()}).appendTo(this.hid("reflector"));
    /* Rotor choices */
    $("<div/>", {class:"reflector-choice", id:this.id("reflector-choice")}).appendTo(this.hid("reflector"));
    $("<button/>", {id:this.id("choiceB"), text:"B"}).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceB")).click({controller:this.controller,
                                        side:this.side, choice:"B"},
                                       changeReflectorClick);
    $("<button/>", {id:this.id("choiceC"), text:"C"}).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceC")).click({controller:this.controller,
                                        side:this.side, choice:"C"},
                                       changeReflectorClick);
  }

  ReflectorView.prototype.getName = function(){
    return "Reflector";
  }
  
  ReflectorView.prototype.id = function(name){
    return name;
  }
  
  ReflectorView.prototype.hid = function(name){
    return "#"+this.id(name);
  }

  
  /* RotorView */
  
  function changeRotorClick(event){
    var controller = event.data.controller;
    controller.changeRotor(event.data.side, event.data.choice);
  }
  
  function changeStartClick(event){
    var controller = event.data.controller;
    controller.changeStart(event.data.side, event.data.value);    
  }

  function changeRingClick(event){
    var controller = event.data.controller;
    controller.changeRing(event.data.side, event.data.value);    
  }
  
  function RotorView(controller, side){
    this.controller = controller;
    this.side = side;
    $("<div/>", {class:"rotor", id:this.id("rotor")}).appendTo("#rotors-container");
    $("<span/>", {text:this.getName()}).appendTo(this.hid("rotor"));
    /* Rotor choices */
    $("<div/>", {class:"rotor-choice", id:this.id("rotor-choice")}).appendTo(this.hid("rotor"));
    for(var name in this.controller.getRotors()){
      $("<button/>", {id:this.id("choice"+name), text:name}).appendTo(this.hid("rotor-choice"));
      $(this.hid("choice"+name)).click({controller:this.controller,
                                        side:this.side, choice:name},
                                       changeRotorClick);
    }
    /* Rotor parameters */

    $("<div/>", {class:"param-container", id:this.id("param-container")}).appendTo(this.hid("rotor"));

    $("<div/>", {class:"param", id:this.id("start-param")}).appendTo(this.hid("param-container"));
    $("<span/>", {text:"Start"}).appendTo(this.hid("start-param"));
    $("<button/>", {id:this.id("startup"), html:"&#8634;"}).appendTo(this.hid("start-param"));
    $("<span/>", {class:"param-value", text:"A"}).appendTo(this.hid("start-param"));
    $("<button/>", {id:this.id("startdown"), html:"&#8634;"}).appendTo(this.hid("start-param"));
    $(this.hid("startup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeStartClick);
    $(this.hid("startdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeStartClick);

    $("<div/>", {class:"param", id:this.id("ring-param")}).appendTo(this.hid("param-container"));
    $("<span/>", {text:"Ring"}).appendTo(this.hid("ring-param"));
    $("<button/>", {id:this.id("ringup"), html:"&#8634;"}).appendTo(this.hid("ring-param"));
    $("<span/>", {class:"param-value", text:"A"}).appendTo(this.hid("ring-param"));
    $("<button/>", {id:this.id("ringdown"), html:"&#8634;"}).appendTo(this.hid("ring-param"));
    $(this.hid("ringup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeRingClick);
    $(this.hid("ringdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeRingClick);

  }

  RotorView.prototype.getName = function(){
    if(this.side == 0){
      return "Left Rotor";
    }
    else if(this.side == 1){
      return "Middle Rotor";
    }
    else if(this.side == 2){
      return "Right Rotor";
    }
  }
  
  RotorView.prototype.id = function(name){
    return name+this.side;
  }
  
  RotorView.prototype.hid = function(name){
    return "#"+this.id(name);
  }
  
  /* Plugboard View */ 
  
  function addPlugClick(event){
    event.data.view.addPlug("Q", "Z");
    console.log($('html').height());
    console.log($('html').width());
  }
  
  function PlugboardView(controller){
    this.itemGenerator = 0;
    this.controller = controller;
    $("<ul/>", {id:"plugboard-list"}).appendTo("#plugboard-container");
    $("<div/>", {id:"plugboard-adder"}).appendTo("#plugboard-container");

    $("<div/>", {id:"add-entries"}).appendTo("#plugboard-adder");
    $("<textarea/>", {id:"entry-one"}).appendTo("#add-entries");
    $("<textarea/>", {id:"entry-two"}).appendTo("#add-entries");
    $("<button/>", {id:"add-button", text:"Add"}).appendTo("#plugboard-adder");
    $("#add-button").click({view:this}, addPlugClick);
  }
  
  PlugboardView.prototype.addPlug = function(char1, char2){
    $("<div/>", {class:"add-item", id:"item"+this.itemGenerator}).appendTo("#plugboard-list");
    $("<div/>", {class:"cross-panel", html:"<div class='cross'>&#x274c;</div>"}).appendTo("#item"+this.itemGenerator);
    $("<span/>", {html:char1+" &#8961; "+char2}).appendTo("#item"+this.itemGenerator);
    $("#item"+this.itemGenerator).click({view:this}, function(event){
      $(this).remove();
      event.data.view.controller.plugboardRemove(char1, char2);
    });    
    this.itemGenerator++;
  }
  
  /* Input View */

  function InputView(controller){
    this.controller = controller;
    $("<div/>", {id:"input-toolbar"}).appendTo("#input-container");
    $("<span/>", {text:"Your message"}).appendTo("#input-toolbar");
    $("<textarea/>").appendTo("#input-container");
  }

    /* Output View */

  function OutputView(controller){
    this.controller = controller;
    $("<div/>", {id:"output-toolbar"}).appendTo("#output-container");
    $("<span/>", {text:"Encrypted message"}).appendTo("#output-toolbar");
    $("<textarea/>", {id:"outputarea"}).appendTo("#output-container");
    $("#outputarea").prop("readonly", false);
  }


  /* MachineController */
  
  function MachineController(){
    
    this.machine = new Machine();
    this.rotorViewList = [];
    this.createRotorView(Machine.LEFT_ROTOR);
    this.createRotorView(Machine.MIDDLE_ROTOR);
    this.createRotorView(Machine.RIGHT_ROTOR);
    this.reflectorView = new ReflectorView(this);
    this.plugboardView = new PlugboardView(this);
    this.inputView = new InputView(this);
    this.outputView = new OutputView(this);
    
  }  
  
  MachineController.prototype.createRotorView = function(side){
    var rotorView = new RotorView(this, side);
    this.rotorViewList.push(rotorView);
  }
  
  MachineController.prototype.changeReflector = function(name){
    console.log("NOT IMPLEMENTED > changeReflector("+name+").");
  }

  MachineController.prototype.changeRotor = function(side, name){
    console.log("NOT IMPLEMENTED > changeRotor("+side+", "+name+").");
  }
 
  MachineController.prototype.changeStart = function(side, value){
    console.log("NOT IMPLEMENTED > changeStart("+side+", "+value+").");
  }

  MachineController.prototype.changeRing = function(side, value){
    console.log("NOT IMPLEMENTED > changeRing("+side+", "+value+").");
  }
  
  MachineController.prototype.plugboardRemove = function(char1, char2){
    console.log("NOT IMPLEMENTED > plugboardRemove("+char1+", "+char2+").");  
  }
  
  MachineController.prototype.getRotors = function(){
    return this.machine.getRotors();
  }

  /* Main */
  
  function main(args){
    var controller = new MachineController();
  }
  
  main();
  
});
