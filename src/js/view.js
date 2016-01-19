$(function(){
  "use strict";

  /* ReflectorView */

  function changeReflectorClick(event){
    event.data.view.changeTo(event.data.choice);
  }

  function ReflectorView(controller, initial){
    this.controller = controller;
    this.lastId = undefined;

    $("<div/>", {class:"rotor", id:this.id("reflector")}).appendTo("#rotors-container");
    $("<span/>", {text:this.getName()}).appendTo(this.hid("reflector"));
    /* Rotor choices */
    $("<div/>", {class:"reflector-choice", id:this.id("reflector-choice")}).appendTo(this.hid("reflector"));
    $("<button/>", {id:this.id("choiceB"), text:"B"}).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceB")).click({view:this, choice:"B"},
                                  changeReflectorClick);
    $("<button/>", {id:this.id("choiceC"), text:"C"}).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceC")).click({view:this, choice:"C"},
                                  changeReflectorClick);
    this.changeTo(initial);
  }

  ReflectorView.prototype.changeTo = function(choice){
    this.controller.changeReflector(choice);
    this.changeSelector(choice);
  }

  ReflectorView.prototype.changeSelector = function(choice){
    var reflId = choice == "B" ? "#choiceB" : "#choiceC";
    HtmlUtil.changeSelector(this, reflId);
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
    event.data.view.changeTo(event.data.choice);
  }

  function changeStartClick(event){
    var controller = event.data.controller;
    controller.changeStart(event.data.side, event.data.value);
  }

  function changeRingClick(event){
    var controller = event.data.controller;
    controller.changeRing(event.data.side, event.data.value);
  }

  function RotorView(controller, side, initial){
    this.controller = controller;
    this.side = side;
    this.lastId = undefined;

    $("<div/>", {class:"rotor", id:this.id("rotor")}).appendTo("#rotors-container");
    $("<span/>", {text:this.getName()}).appendTo(this.hid("rotor"));
    /* Rotor choices */
    $("<div/>", {class:"rotor-choice", id:this.id("rotor-choice")}).appendTo(this.hid("rotor"));
    for(var name in this.controller.getRotors()){
      $("<button/>", {id:this.id("choice"+name), text:name}).appendTo(this.hid("rotor-choice"));
      $(this.hid("choice"+name)).click({view:this, choice:name},
                                       changeRotorClick);
    }
    /* Rotor parameters */

    $("<div/>", {class:"param-container", id:this.id("param-container")}).appendTo(this.hid("rotor"));

    $("<div/>", {class:"param", id:this.id("start-param")}).appendTo(this.hid("param-container"));
    $("<span/>", {text:"Start"}).appendTo(this.hid("start-param"));
    $("<button/>", {id:this.id("startup"), html:"&#8635;"}).appendTo(this.hid("start-param"));
    $("<span/>", {class:"param-value", text:"A"}).appendTo(this.hid("start-param"));
    $("<button/>", {id:this.id("startdown"), html:"&#8634;"}).appendTo(this.hid("start-param"));
    $(this.hid("startup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeStartClick);
    $(this.hid("startdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeStartClick);

    $("<div/>", {class:"param", id:this.id("ring-param")}).appendTo(this.hid("param-container"));
    $("<span/>", {text:"Ring"}).appendTo(this.hid("ring-param"));
    $("<button/>", {id:this.id("ringup"), html:"&#8635;"}).appendTo(this.hid("ring-param"));
    $("<span/>", {class:"param-value", text:"A"}).appendTo(this.hid("ring-param"));
    $("<button/>", {id:this.id("ringdown"), html:"&#8634;"}).appendTo(this.hid("ring-param"));
    $(this.hid("ringup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeRingClick);
    $(this.hid("ringdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeRingClick);

    this.changeTo(initial);
  }

  RotorView.prototype.changeTo = function(choice){
    this.controller.changeRotor(this.side, choice);
    this.changeSelector(choice);
  }

  RotorView.prototype.changeSelector = function(choice){
    HtmlUtil.changeSelector(this, this.hid("choice"+choice));
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
    var values = event.data.view.getEntriesValue();
    if(!values["error"]){
      event.data.view.addPlug(values["entry1"], values["entry2"]);
      if(event.data.view.controller.hasMaximumPlugboardConnection()){
        event.data.view.disableAddButton();
      }
    }
  }

  function PlugboardView(controller){
    this.itemGenerator = 0;
    this.controller = controller;
    $("<ul/>", {id:"plugboard-list"}).appendTo("#plugboard-container");
    $("<div/>", {id:"plugboard-adder"}).appendTo("#plugboard-container");

    $("<div/>", {id:"add-entries"}).appendTo("#plugboard-adder");
    $("<textarea/>", {id:"entry-one", maxlength:1}).appendTo("#add-entries");
    $("<textarea/>", {id:"entry-two", maxlength:1}).appendTo("#add-entries");
    $("<button/>", {id:"add-button", text:"Add to plugboard"}).appendTo("#plugboard-adder");
    $("#add-button").click({view:this}, addPlugClick);
  }

  PlugboardView.prototype.addPlug = function(entry1, entry2){
    this.controller.addPlugboardConnection(entry1, entry2);
    $("<div/>", {class:"add-item", id:"item"+this.itemGenerator}).appendTo("#plugboard-list");
    $("<div/>", {class:"cross-panel", html:"<div class='cross'>&#x274c;</div>"}).appendTo("#item"+this.itemGenerator);
    $("<span/>", {html:entry1.toUpperCase()+" &#8961; "+entry2.toUpperCase()}).appendTo("#item"+this.itemGenerator);
    $("#item"+this.itemGenerator).click({view:this}, function(event){
      $(this).remove();
      event.data.view.controller.removePlugboardConnection(entry1, entry2);
      if(!event.data.view.controller.hasMaximumPlugboardConnection()){
        event.data.view.enableAddButton();
      }
    });
    this.itemGenerator++;
  }

  PlugboardView.prototype.getEntriesValue = function(){
    this.unshowError("#entry-one");
    this.unshowError("#entry-two");
    var values = {};
    var entry1 = this.getEntry("#entry-one");
    var entry2 = this.getEntry("#entry-two");
    values["error"] = true;
    if(entry1 == undefined){
      this.showError("#entry-one");
    }
    if(entry2 == undefined){
      this.showError("#entry-two");
    }
    if(entry1 != undefined && entry2 != undefined){
      values["error"] = false;
      values["entry1"] = entry1;
      values["entry2"] = entry2;
      this.cleanEntry("#entry-one");
      this.cleanEntry("#entry-two");

    }
    return values;
  }

  PlugboardView.prototype.getEntry = function(entryId){
    var value = $(entryId).val();
    if(CharUtil.isChar(value) && !this.controller.isPlugboardUsed(value)){
      return value;
    }else{
      return undefined;
    }
  }

  PlugboardView.prototype.showError = function(entryId){
    $(entryId).css({borderColor:"rgb(211, 118, 118)"});
  }

  PlugboardView.prototype.unshowError = function(entryId){
    $(entryId).css({borderColor:"#004d95"});
  }

  PlugboardView.prototype.cleanEntry = function(entryId){
    //$(entryId).val("");
  }

  PlugboardView.prototype.disableAddButton = function(){
    $("#add-button").prop("disabled", true);
  }
  PlugboardView.prototype.enableAddButton = function(){
    $("#add-button").prop("disabled", false);
  }

  /* Input View */

  function inputChangeEvent(event){
    var controller = event.data.controller;
    controller.handleInput();
  }

  function InputView(controller){
    this.controller = controller;
    $("<div/>", {id:"input-toolbar"}).appendTo("#input-container");
    $("<span/>", {text:"Your message"}).appendTo("#input-toolbar");
    $("<textarea/>", {id:"inputarea"}).appendTo("#input-container");

    //$("#inputarea").keydown({controller:this.controller}, inputKeyDownEvent);
    //$("#inputarea").change({controller:this.controller}, inputChangeEvent);
    //$('#inputarea').bind('paste', {test:this}, function(event){console.log('this actually paste' + event.data.test.getSelectionStart())});
    $('#inputarea').bind('input', {controller:this.controller},
                         inputChangeEvent);


  }

  InputView.prototype.getContent = function(){
    return $("#inputarea").val();
  }

  InputView.prototype.setContent = function(content){
    return $("#inputarea").val(content);
  }

  InputView.prototype.getCharAt = function(index){
    return this.getContent().charAt(index);
  }

  InputView.prototype.getSelectionStart = function(){
    return $("#inputarea")[0].selectionStart;
  }

  InputView.prototype.getSelectionEnd = function(){
    return $("#inputarea")[0].selectionEnd;
  }

  /* Output View */

  function OutputView(controller){
    this.controller = controller;
    $("<div/>", {id:"output-toolbar"}).appendTo("#output-container");
    $("<div/>", {id:"output-menu"}).appendTo("#output-toolbar");
    $("<div/>", {id:"output-title"}).appendTo("#output-toolbar");
    $("<button/>", {html:"Copy"}).appendTo("#output-menu");
    $("<button/>", {html:"Cut"}).appendTo("#output-menu");
    $("<span/>", {text:"Encrypted message"}).appendTo("#output-title");
    $("<textarea/>", {id:"outputarea", text:""}).appendTo("#output-container");
    $("#outputarea").prop("readonly", true);

  }

  OutputView.SPACE_TAG = " ";

  OutputView.prototype.push = function(element){
    $("#outputarea").val($("#outputarea").val() + element);
  }

  OutputView.prototype.pushSpace = function(){
    this.push(OutputView.SPACE_TAG);
  }

  OutputView.prototype.removeFrom = function(index){
    var content = this.getContent();
    var removed = StringUtil.removeSeq(content, index, this.getSize());
    this.setContent(removed);
  }

  OutputView.prototype.getContent = function(){
    return $("#outputarea").val();
  }

  OutputView.prototype.setContent = function(content){
    return $("#outputarea").val(content);
  }

  OutputView.prototype.getSize = function(){
    this.getContent().length;
  }

  /* MachineController */

  function MachineController(){

    this.machine = new Machine();
    this.plugItemCounter = 0;
    this.rotorViewList = [];
    this.createRotorView(Machine.LEFT_ROTOR, "I");
    this.createRotorView(Machine.MIDDLE_ROTOR, "II");
    this.createRotorView(Machine.RIGHT_ROTOR, "III");
    this.reflectorView = new ReflectorView(this, "C");
    this.plugboardView = new PlugboardView(this);
    this.inputView = new InputView(this);
    this.outputView = new OutputView(this);

  }

  MachineController.MAXIMUM_PLUGITEM = 10;

  MachineController.prototype.createRotorView = function(side, initial){
    var rotorView = new RotorView(this, side, initial);
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

  MachineController.prototype.addPlugboardConnection = function(entry1, entry2){
    this.plugItemCounter++;
    console.log("NOT IMPLEMENTED > addPlugboardConnection("+entry1+", "+entry2+").");
  }

  MachineController.prototype.removePlugboardConnection = function(entry1, entry2){
    this.plugItemCounter--;
    console.log("NOT IMPLEMENTED > removePlugboardConnection("+entry1+", "+entry2+").");
  }

  MachineController.prototype.isPlugboardUsed = function(char){
    console.log("NOT IMPLEMENTED > isPlugboardUsed("+char+").");
    return false;
  }

  MachineController.prototype.handleInput = function(){
    console.log("NOT IMPLEMENTED > handleInput().");
    this.outputView.setContent(this.inputView.getContent());

  }

  /*MachineController.prototype.handleInput = function(which, key){
    console.log("NOT IMPLEMENTED > handleInput("+which+", "+key+").");
    console.log("SELECTION > " + "("+this.inputView.getSelectionStart()+","
                                +""+this.inputView.getSelectionEnd()+").");
    if(KeyCode.isAlpha(which)){
      // encrypt
    }else if(KeyCode.isSpace(which)){
      // push space
    }else if(KeyCode.isBackspace(which)){
     // bs delete
    }else if(KeyCode.isDelete(which)){
      // delete
    }else{
      // Do nothing
    }
  }*/

  MachineController.prototype.hasMaximumPlugboardConnection = function(){
    return this.plugItemCounter == MachineController.MAXIMUM_PLUGITEM;
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
