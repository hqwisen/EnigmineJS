$(function(){
  "use strict";

  /* ReflectorView */
  
  function test(event){
    console.log(event.data.value);
  }
  
  function ReflectorView(controller){
    this.controller = controller;
    $("#rotors-container").append(HtmlUtil.div("reflector", this.id("reflector")));
    $(this.hid("reflector")).append(HtmlUtil.div("reflector-button-container",
                                                 this.id("reflb-container")));
    $(this.hid("reflb-container")).append(HtmlUtil.button("", this.id("refl-B"), "B"));
    $(this.hid("reflb-container")).append(HtmlUtil.button("",this.id("refl-C"), "C"));
    $(this.hid("refl-B")).click({value:"value"}, test);
  }
  
  ReflectorView.prototype.id = function(name){
    return name;
  }
  
  ReflectorView.prototype.hid = function(name){
    return "#"+this.id(name);
  }

  
  /* RotorView */
  
  function RotorView(controller, side){
    this.controller = controller;
    this.side = side;
    $("#rotors-container").append(HtmlUtil.div("rotor", this.id("rotor")));
    $(this.hid("rotor")).append(HtmlUtil.span("", "", "Rotor " + side));
    $(this.hid("rotor")).append(HtmlUtil.div("rotor-button-container", this.id("rb-container")));
    for(var name in this.controller.getRotors()){
      $(this.hid("rb-container")).append(HtmlUtil.button("", "", name));
    }
    $(this.hid("rotor")).append(HtmlUtil.div("rotor-param-container", this.id("rp-container")));
    $(this.hid("rp-container")).append(HtmlUtil.div("rotor-param", this.id("rp-start")));
    $(this.hid("rp-start")).append(HtmlUtil.span("" , "", "Start"));
    $(this.hid("rp-start")).append(HtmlUtil.button("rotor-param-element", "", "up"));
    $(this.hid("rp-start")).append(HtmlUtil.span("rotor-param-element", "", "up"));
    $(this.hid("rp-start")).append(HtmlUtil.button("rotor-param-element", "", "up"));
    $(this.hid("rp-container")).append(HtmlUtil.div("rotor-param", this.id("rp-ring")));
    $(this.hid("rp-ring")).append(HtmlUtil.span("", "", "Ring"));
    $(this.hid("rp-ring")).append(HtmlUtil.button("rotor-param-element", "", "up"));
    $(this.hid("rp-ring")).append(HtmlUtil.span("rotor-param-element", "", "up"));
    $(this.hid("rp-ring")).append(HtmlUtil.button("rotor-param-element", "", "up"));
  }
  
  RotorView.prototype.id = function(name){
    return name+this.side;
  }
  
  RotorView.prototype.hid = function(name){
    return "#"+this.id(name);
  }
  
  /* MachineController */
  
  function MachineController(){
    
    this.machine = new Machine();
    this.rotorViewList = [];
    this.reflectorView = new ReflectorView(this);
    this.createRotorView(Machine.LEFT_ROTOR);
    this.createRotorView(Machine.MIDDLE_ROTOR);
    this.createRotorView(Machine.RIGHT_ROTOR);
    
  }  
  
  MachineController.prototype.createRotorView = function(side){
    var rotorView = new RotorView(this, side);
    this.rotorViewList.push(rotorView);
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
