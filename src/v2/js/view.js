$(function(){
  "use strict";

  /* ReflectorView */
  
  function changeReflectorClick(event){
    var controller = event.data.controller;
    controller.changeReflector(event.data.choice);
  }
  
  function ReflectorView(controller){
    this.controller = controller;
    $("#rotors-container").append(HtmlUtil.div("reflector", this.id("reflector")));
    $(this.hid("reflector")).append(HtmlUtil.div("reflector-button-container",
                                                 this.id("reflb-container")));
    $(this.hid("reflb-container")).append(HtmlUtil.button("", this.id("refl-B"), "B"));
    $(this.hid("reflb-container")).append(HtmlUtil.button("",this.id("refl-C"), "C"));
    $(this.hid("refl-B")).click({controller:this.controller, choice:"B"},
                                changeReflectorClick);
    $(this.hid("refl-C")).click({controller:this.controller, choice:"C"},
                                changeReflectorClick);
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
    $("#rotors-container").append(HtmlUtil.div("rotor", this.id("rotor")));
    $(this.hid("rotor")).append(HtmlUtil.span("", "", "Rotor " + side));
    $(this.hid("rotor")).append(HtmlUtil.div("rotor-button-container", this.id("rb-container")));
    for(var name in this.controller.getRotors()){
      $(this.hid("rb-container")).append(HtmlUtil.button("", this.id("choice"+name), name));
      $(this.hid("choice"+name)).click({controller:this.controller,
                                        side:this.side, choice:name},
                                       changeRotorClick);
    }
    $(this.hid("rotor")).append(HtmlUtil.div("rotor-param-container", this.id("rp-container")));
    $(this.hid("rp-container")).append(HtmlUtil.div("rotor-param", this.id("rp-start")));
    $(this.hid("rp-start")).append(HtmlUtil.span("" , "", "Start"));
    $(this.hid("rp-start")).append(HtmlUtil.button("rotor-param-element",
                                                   this.id("startup"), "up"));
    $(this.hid("rp-start")).append(HtmlUtil.span("rotor-param-element", "", "A"));
    $(this.hid("rp-start")).append(HtmlUtil.button("rotor-param-element",
                                                   this.id("startdown"), "down"));

    $(this.hid("startup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeStartClick);
    $(this.hid("startdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeStartClick);
$(this.hid("rp-container")).append(HtmlUtil.div("rotor-param", this.id("rp-ring")));
    $(this.hid("rp-ring")).append(HtmlUtil.span("", "", "Ring"));
    $(this.hid("rp-ring")).append(HtmlUtil.button("rotor-param-element",
                                                  this.id("ringup"), "up"));
    $(this.hid("rp-ring")).append(HtmlUtil.span("rotor-param-element", "", "A"));
    $(this.hid("rp-ring")).append(HtmlUtil.button("rotor-param-element",
                                                  this.id("ringdown"), "down"));
    $(this.hid("ringup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeRingClick);
    $(this.hid("ringdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeRingClick);
  }
  
  RotorView.prototype.id = function(name){
    return name+this.side;
  }
  
  RotorView.prototype.hid = function(name){
    return "#"+this.id(name);
  }
  
  /* Plugboard View */ 
  
  function addPlugClick(event){
    event.data.view.addPlug("A | B");
  }
  
  function PlugboardView(controller){
    this.itemGenerator = 0;
    this.controller = controller;
    $("#plugboard-container").append(HtmlUtil.ul("plugboard-list", "plugboard-list"));
    $("#plugboard-container").append(HtmlUtil.div("plugboard-add", "plugboard-add"));
    $("#plugboard-add").append(HtmlUtil.button("plugboard-add", "pb-add-button", "Add"));
    $("#pb-add-button").click({view:this}, addPlugClick);

  }
  
  PlugboardView.prototype.addPlug = function(value){
    var elemLi = HtmlUtil.li("", "pb-"+this.itemGenerator);
    $("#plugboard-list").append(elemLi);
    $("#pb-"+this.itemGenerator).append(HtmlUtil.a("", "", "A|B"));
    $("#pb-"+this.itemGenerator).click({view:this}, function(){
      $(this).remove();
    });    
    this.itemGenerator++;
    
  }
  
  /* MachineController */
  
  function MachineController(){
    
    this.machine = new Machine();
    this.rotorViewList = [];
    this.reflectorView = new ReflectorView(this);
    this.createRotorView(Machine.LEFT_ROTOR);
    this.createRotorView(Machine.MIDDLE_ROTOR);
    this.createRotorView(Machine.RIGHT_ROTOR);
    this.plugboardView = new PlugboardView(this);
    
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
  
  MachineController.prototype.getRotors = function(){
    return this.machine.getRotors();
  }

  /* Main */
  
  function main(args){
    var controller = new MachineController();
  }
  
  main();
  
});
