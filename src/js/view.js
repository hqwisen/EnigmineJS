// fixem ctrl+z, ctrl+y


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
    this.changeSelector(initial);
  }

  ReflectorView.prototype.changeTo = function(choice){
    this.controller.changeReflector(choice);
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
    $("<button/>", {class:"rotate-left", id:this.id("startup"), html:"&#8635;"}).appendTo(this.hid("start-param"));
    $("<span/>", {class:"param-value", id:this.id("startvalue"), text:"#"}).appendTo(this.hid("start-param"));
    $("<button/>", {class:"rotate-right", id:this.id("startdown"), html:"&#8634;"}).appendTo(this.hid("start-param"));
    $(this.hid("startup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeStartClick);
    $(this.hid("startdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeStartClick);

    $("<div/>", {class:"param", id:this.id("ring-param")}).appendTo(this.hid("param-container"));
    $("<span/>", {text:"Ring"}).appendTo(this.hid("ring-param"));
    $("<button/>", {class:"rotate-left", id:this.id("ringup"), html:"&#8635;"}).appendTo(this.hid("ring-param"));
    $("<span/>", {class:"param-value", id:this.id("ringvalue"), text:"#"}).appendTo(this.hid("ring-param"));
    $("<button/>", {class:"rotate-right", id:this.id("ringdown"), html:"&#8634;"}).appendTo(this.hid("ring-param"));
    $(this.hid("ringup")).click({controller:this.controller, side:this.side, value:+1},
                                 changeRingClick);
    $(this.hid("ringdown")).click({controller:this.controller, side:this.side, value:-1},
                                 changeRingClick);

    this.changeSelector(initial);
  }

  RotorView.prototype.changeTo = function(choice){
    this.controller.changeRotor(this.side, choice);
  }

  RotorView.prototype.changeSelector = function(choice){
    HtmlUtil.changeSelector(this, this.hid("choice"+choice));
  }

  RotorView.prototype.refreshStart = function(value){
    $(this.hid("startvalue")).text(value);
  }

  RotorView.prototype.refreshRing = function(value){
    $(this.hid("ringvalue")).text(value);
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
    $("<button/>", {id:"add-button", text:this.getAddButtonName()}).appendTo("#plugboard-adder");
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
        event.data.view.refreshAddButton();
      }
    });
    this.refreshAddButton();
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
    if(CharUtil.isAlpha(value) && !this.controller.isPlugboardUsed(value)){
      return value;
    }else{
      return undefined;
    }
  }

  PlugboardView.prototype.showError = function(entryId){
    $(entryId).css({borderColor:"rgb(199, 0, 0)"});
  }

  PlugboardView.prototype.unshowError = function(entryId){
    $(entryId).css({borderColor:"#004d95"});
  }

  PlugboardView.prototype.cleanEntry = function(entryId){
    $(entryId).val("");
  }

  PlugboardView.prototype.getAddButtonName = function(){
    return "Add to plugboard ("+this.controller.getRemainingConnection()+")";
  }

  PlugboardView.prototype.refreshAddButton = function(){
    $("#add-button").text(this.getAddButtonName());
  }

  PlugboardView.prototype.disableAddButton = function(){
    $("#entry-one").prop("disabled", true);
    $("#entry-two").prop("disabled", true);
    $("#add-button").prop("disabled", true);
  }
  PlugboardView.prototype.enableAddButton = function(){
    $("#entry-one").prop("disabled", false);
    $("#entry-two").prop("disabled", false);
    $("#add-button").prop("disabled", false);
  }

  /* Input View */

  function inputChangeEvent(event){
    console.log("Call to change event.");
    var controller = event.data.controller;
    var view = event.data.view;
    controller.handleInput();
  }


  function inputDownEvent(event){
    var controller = event.data.controller;
    var view = event.data.view;
    var start = view.getSelectionStart();
    var end = view.getSelectionEnd();
    if(KeyCode.isBackspace(event.which) && start == end){
      start--;
    }
    controller.setStart(start);
    controller.setBeforeBlock(view.getLastBlock(start));

  }

  function inputPasteEvent(event){
    var view = event.data.view;
    console.log("NOT IMPLEMENTED > <PASTING NOT IMPLEMENTED>");
  }

  function InputView(controller){
    this.controller = controller;

    $("<div/>", {id:"input-toolbar"}).appendTo("#input-container");
    $("<div/>", {id:"input-menu"}).appendTo("#input-toolbar");
    $("<div/>", {id:"input-title"}).appendTo("#input-toolbar");
    $("<button/>", {html:"PASTE", id:"inputpaste"}).appendTo("#input-menu");
    $("<span/>", {text:"Message to crypt"}).appendTo("#input-title");
    $("<textarea/>", {id:"inputarea", text:""}).appendTo("#input-container");
    $("#inputpaste").click({view:this}, inputPasteEvent);


    $("#inputarea").keydown({controller:this.controller, view:this}, inputDownEvent);
    $("#inputarea").mousedown({controller:this.controller, view:this}, inputDownEvent);
    //$("#inputarea").change({controller:this.controller}, inputChangeEvent);
    //$('#inputarea').bind('paste', {test:this}, function(event){console.log('this actually paste' + event.data.test.getSelectionStart())});
    $('#inputarea').bind('input', {controller:this.controller, view:this},
                         inputChangeEvent);


  }

  InputView.prototype.getContent = function(){
    return $("#inputarea").val();
  }

  InputView.prototype.setContent = function(content){
    return $("#inputarea").val(content);
  }

  InputView.prototype.addContent = function(content){
    this.setContent(this.getContent() + content);
  }

  InputView.prototype.getSize = function(){
    return this.getContent().length;
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
  InputView.prototype.getBlock = function(start, end){
    return this.getContent().substr(start, end);
  }

  InputView.prototype.getLastBlock = function(start){
    return this.getBlock(start, this.getSize());
  }



  /* Output View */

  function outputCopyEvent(event){
    var controller = event.data.controller;
    console.log("NOT IMPLEMENTED > outputCopyEvent");
  }

  function outputSelectEvent(event){
    var controller = event.data.controller;
    console.log("NOT IMPLEMENTED > outputSelectEvent");
  }

  function OutputView(controller){
    this.controller = controller;
    $("<div/>", {id:"output-toolbar"}).appendTo("#output-container");
    $("<div/>", {id:"output-menu"}).appendTo("#output-toolbar");
    $("<div/>", {id:"output-title"}).appendTo("#output-toolbar");
    $("<button/>", {html:"COPY", id:"outputcopy"}).appendTo("#output-menu");
    $("<button/>", {html:"SELECT", id:"outputselect"}).appendTo("#output-menu");
    $("<span/>", {text:"Encrypted message"}).appendTo("#output-title");
    $("<textarea/>", {id:"outputarea", text:""}).appendTo("#output-container");
    $("#outputarea").prop("readonly", true);
    $("#outputcopy").click({controller:this.controller}, outputCopyEvent);
    $("#outputselect").click({controller:this.controller}, outputSelectEvent);

  }

  OutputView.SPACE_TAG = " ";

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

  OutputView.prototype.addContent = function(content){
    this.setContent(this.getContent() + content);
  }

  OutputView.prototype.addSpace = function(){
    this.addContent(OutputView.SPACE_TAG);
  }

  OutputView.prototype.getSize = function(){
    return this.getContent().length;
  }

  /* MachineController */

  function MachineController(){

    this.machine = new Machine("Enigma 1",
                               MachineController.MAXIMUM_PLUGITEM);
    this.plugItemCounter = 0;
    this.startIndex = -1;
    this.beforeBlock = "";
    this.rotorViewList = {};
    this.createRotorView(Machine.LEFT_ROTOR);
    this.createRotorView(Machine.MIDDLE_ROTOR);
    this.createRotorView(Machine.RIGHT_ROTOR);
    this.reflectorView = new ReflectorView(this, this.machine.getActiveReflector().getName());
    this.plugboardView = new PlugboardView(this);
    this.inputView = new InputView(this);
    this.outputView = new OutputView(this);

  }

  MachineController.MAXIMUM_PLUGITEM = 10;

  MachineController.prototype.createRotorView = function(side){
    var rotorView = new RotorView(this, side, this.machine.getRotorOnSide(side).getName());
    rotorView.refreshStart(this.machine.getStartRotor(side));
    rotorView.refreshRing(this.machine.getRingRotor(side));
    this.rotorViewList[side] = (rotorView);
  }

  MachineController.prototype.changeReflector = function(name){
    console.log("^^ IMPL > changeReflector("+name+").");
    this.machine.setActiveReflector(name);
    this.reflectorView.changeSelector(name);
  }

  MachineController.prototype.changeRotor = function(side, name){
    console.log("^^ IMPL > changeRotor("+side+", "+name+").");
    var old = this.machine.getRotorOnSide(side).getName();
    this.machine.setRotorOnSide(side, name);
    this.rotorViewList[side].changeSelector(name);
    this.rotorViewList[side].refreshStart(this.machine.getStartRotor(side));
    this.rotorViewList[side].refreshRing(this.machine.getRingRotor(side));
    for(var otherSide in [Machine.LEFT_ROTOR, Machine.MIDDLE_ROTOR, Machine.RIGHT_ROTOR]){
      if(side != otherSide && this.machine.getRotorOnSide(otherSide).getName() == name){
        this.machine.setRotorOnSide(otherSide, old);
        this.rotorViewList[otherSide].changeSelector(old);
        this.rotorViewList[otherSide].refreshStart(this.machine.getStartRotor(otherSide));
        this.rotorViewList[otherSide].refreshRing(this.machine.getRingRotor(otherSide));
      }
    }
  }

  // FIXME to avoid conflict, |value| = 1
  MachineController.prototype.changeStart = function(side, value){
    console.log("^^ IMPL > changeStart("+side+", "+value+").");
    var char = this.machine.getStartRotor(side);
    var charCode = char.charCodeAt(0);
    if(value == 1 && charCode >= Rotor.CHARCODEMAXSET){
      charCode = Rotor.CHARCODEMINSET;
    }else if(value == -1 && charCode <= Rotor.CHARCODEMINSET){
      charCode = Rotor.CHARCODEMAXSET;
    }else{
      charCode += (value);
    }
    var newStart = String.fromCharCode(charCode);
    this.machine.setStartRotor(side, newStart);
    this.rotorViewList[side].refreshStart(newStart);
  }

  // FIXME to avoid conflict, |value| = 1
  MachineController.prototype.changeRing = function(side, value){
    console.log("^^ IMPL > changeRing("+side+", "+value+").");
    var char = this.machine.getRingRotor(side);
    var charCode = char.charCodeAt(0);
    if(value == 1 && charCode >= Rotor.CHARCODEMAXSET){
      charCode = Rotor.CHARCODEMINSET;
    }else if(value == -1 && charCode <= Rotor.CHARCODEMINSET){
      charCode = Rotor.CHARCODEMAXSET;
    }else{
      charCode += (value);
    }
    var newRing = String.fromCharCode(charCode);
    this.machine.setRingRotor(side, newRing);
    this.rotorViewList[side].refreshRing(newRing);
  }

  MachineController.prototype.addPlugboardConnection = function(entry1, entry2){
    console.log("^^ IMPL > addPlugboardConnection("+entry1+", "+entry2+").");
    this.plugItemCounter++;
    this.machine.addPlugboardConnection(entry1, entry2);
  }

  MachineController.prototype.removePlugboardConnection = function(entry1, entry2){
    console.log("^^ IMPL > removePlugboardConnection("+entry1+", "+entry2+").");
    this.plugItemCounter--;
    this.machine.removePlugboardConnection(entry1, entry2);
  }

  MachineController.prototype.isPlugboardUsed = function(char){
    console.log("^^ IMPL > isPlugboardUsed("+char+").");
    return this.machine.isPlugboardUsed(char);
  }

  MachineController.prototype.handleInput = function(){
    console.log("^^ IMPL > handleInput().");
    this.reverse(this.getBeforeBlock());
    var block = this.inputView.getLastBlock(this.startIndex);
    var cryptedBlock = this.crypt(block);
    this.outputView.removeFrom(this.startIndex);
    this.outputView.addContent(cryptedBlock);
  }

  MachineController.prototype.reverse = function(block){
    var counter = 0;
    for(var i=0; i<block.length;i++){
      if(CharUtil.isAlpha(block[i])){
        counter++;
        this.machine.reverse(1);
        this.refreshParameters();
      }
    }
    console.log("NOT IMPLEMENTED > reversing: " + block + "; counter = "+counter);
  }

  MachineController.prototype.crypt = function(block){
    var cryptedBlock = "";
    var crypted = "";
    for(var i=0; i<block.length;i++){
      if(CharUtil.isAlpha(block[i])){
        crypted = this.machine.crypt(block[i]);
        cryptedBlock += CharUtil.isLowerCase(block[i]) ? crypted.toLowerCase() : crypted.toUpperCase() ;
        this.refreshParameters();
      }else{
        cryptedBlock += block[i];
      }
    }
    console.log("NOT IMPLEMENTED > crypt:" + block + " -> " + cryptedBlock);
    return cryptedBlock;
  }

  MachineController.prototype.setStart = function(index){
    this.startIndex = index;
  }

  MachineController.prototype.getStart = function(){
    return this.startIndex;
  }

  MachineController.prototype.setBeforeBlock = function(block){
    this.beforeBlock = block;
  }

  MachineController.prototype.getBeforeBlock = function(){
    return this.beforeBlock;
  }

  MachineController.prototype.hasMaximumPlugboardConnection = function(){
    return this.plugItemCounter == this.machine.getMaxCable();
  }

  MachineController.prototype.getRemainingConnection = function(){
    return this.machine.getMaxCable() - this.plugItemCounter;
  }

  MachineController.prototype.getRotors = function(){
    return this.machine.getRotors();
  }

  MachineController.prototype.refreshParameters = function(){
    for(var side in this.rotorViewList){
      this.rotorViewList[side].refreshStart(this.machine.getStartRotor(side));
      this.rotorViewList[side].refreshRing(this.machine.getRingRotor(side));
    }
  }

  /* Main */

  function main(args){
    var controller = new MachineController();
  }

  main();

});
