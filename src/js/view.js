// FIXME ctrl+z, ctrl+y
// TODO afficher position de depart
// TODO input back up
// TODO plugboard
// TODO selection + keydown (pas delete ou backspace
// TODO Keydown au mileu du texte
// TODO delete of non-alpha char
// TODO quand ecrit texte au milieu
// TODO static method outside class
// TODO Fix behaviour plugboard (int and out !!!)

$(function () {
  "use strict";

  /* ReflectorView */

  function changeReflectorClick(event) {
    event.data.view.changeTo(event.data.choice);
  }

  function ReflectorView(controller, initial) {
    this.controller = controller;
    this.lastId = undefined;

    $("<div/>", {
      class: "rotor",
      id: this.id("reflector")
    }).appendTo("#rotors-container");
    $("<span/>", {
      text: this.getName()
    }).appendTo(this.hid("reflector"));
    /* Rotor choices */
    $("<div/>", {
      class: "reflector-choice",
      id: this.id("reflector-choice")
    }).appendTo(this.hid("reflector"));
    $("<button/>", {
      id: this.id("choiceB"),
      text: "B"
    }).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceB")).click({
        view: this,
        choice: "B"
      },
      changeReflectorClick);
    $("<button/>", {
      id: this.id("choiceC"),
      text: "C"
    }).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceC")).click({
        view: this,
        choice: "C"
      },
      changeReflectorClick);
    /* Rotor parameters */
    $("<div/>", {
      class: "param-container",
      id: this.id("param-container")
    }).appendTo(this.hid("reflector"));
    $("<div/>", {
      class: "param",
      id: this.id("start-param")
    }).appendTo(this.hid("param-container"));
    $("<span/>", {
      text: "Start"
    }).appendTo(this.hid("start-param"));
    $("<button/>", {
      class: "rotate-left",
      id: this.id("startup"),
      html: "&#8635;"
    }).appendTo(this.hid("start-param"));
    $("<span/>", {
      class: "param-value",
      id: this.id("startvalue"),
      text: "#"
    }).appendTo(this.hid("start-param"));
    $("<button/>", {
      class: "rotate-right",
      id: this.id("startdown"),
      html: "&#8634;"
    }).appendTo(this.hid("start-param"));
    $(this.hid("startup")).attr("disabled", true);
    $(this.hid("startdown")).attr("disabled", true);
    $("<div/>", {
      class: "param",
      id: this.id("ring-param")
    }).appendTo(this.hid("param-container"));
    $("<span/>", {
      text: "Ring"
    }).appendTo(this.hid("ring-param"));
    $("<button/>", {
      class: "rotate-left",
      id: this.id("ringup"),
      html: "&#8635;"
    }).appendTo(this.hid("ring-param"));
    $("<span/>", {
      class: "param-value",
      id: this.id("ringvalue"),
      text: "#"
    }).appendTo(this.hid("ring-param"));
    $("<button/>", {
      class: "rotate-right",
      id: this.id("ringdown"),
      html: "&#8634;"
    }).appendTo(this.hid("ring-param"));
    $(this.hid("ringup")).attr("disabled", true);
    $(this.hid("ringdown")).attr("disabled", true);


    this.changeSelector(initial);
  }

  ReflectorView.prototype.changeTo = function (choice) {
    this.controller.changeReflector(choice);
  }

  ReflectorView.prototype.changeSelector = function (choice) {
    var reflId = choice == "B" ? "#choiceB" : "#choiceC";
    HtmlUtil.changeSelector(this, reflId);
  }

  ReflectorView.prototype.getName = function () {
    return "Reflector";
  }

  ReflectorView.prototype.id = function (name) {
    return name;
  }

  ReflectorView.prototype.hid = function (name) {
    return "#" + this.id(name);
  }


  /* RotorView */

  function changeRotorClick(event) {
    event.data.view.changeTo(event.data.choice);
  }

  function changeStartClick(event) {
    var controller = event.data.controller;
    controller.changeStart(event.data.side, event.data.value);
  }

  function changeRingClick(event) {
    var controller = event.data.controller;
    controller.changeRing(event.data.side, event.data.value);
  }

  function RotorView(controller, side, initial) {
    this.controller = controller;
    this.side = side;
    this.lastId = undefined;

    $("<div/>", {
      class: "rotor",
      id: this.id("rotor")
    }).appendTo("#rotors-container");
    $("<span/>", {
      text: this.getName()
    }).appendTo(this.hid("rotor"));
    /* Rotor choices */
    $("<div/>", {
      class: "rotor-choice",
      id: this.id("rotor-choice")
    }).appendTo(this.hid("rotor"));
    for (var name in this.controller.getRotors()) {
      $("<button/>", {
        id: this.id("choice" + name),
        text: name
      }).appendTo(this.hid("rotor-choice"));
      $(this.hid("choice" + name)).click({
          view: this,
          choice: name
        },
        changeRotorClick);
    }
    /* Rotor parameters */

    $("<div/>", {
      class: "param-container",
      id: this.id("param-container")
    }).appendTo(this.hid("rotor"));

    $("<div/>", {
      class: "param",
      id: this.id("start-param")
    }).appendTo(this.hid("param-container"));
    $("<span/>", {
      text: "Start"
    }).appendTo(this.hid("start-param"));
    $("<button/>", {
      class: "rotate-left",
      id: this.id("startup"),
      html: "&#8635;"
    }).appendTo(this.hid("start-param"));
    $("<span/>", {
      class: "param-value",
      id: this.id("startvalue"),
      text: "#"
    }).appendTo(this.hid("start-param"));
    $("<button/>", {
      class: "rotate-right",
      id: this.id("startdown"),
      html: "&#8634;"
    }).appendTo(this.hid("start-param"));
    $(this.hid("startup")).click({
        controller: this.controller,
        side: this.side,
        value: +1
      },
      changeStartClick);
    $(this.hid("startdown")).click({
        controller: this.controller,
        side: this.side,
        value: -1
      },
      changeStartClick);

    $("<div/>", {
      class: "param",
      id: this.id("ring-param")
    }).appendTo(this.hid("param-container"));
    $("<span/>", {
      text: "Ring"
    }).appendTo(this.hid("ring-param"));
    $("<button/>", {
      class: "rotate-left",
      id: this.id("ringup"),
      html: "&#8635;"
    }).appendTo(this.hid("ring-param"));
    $("<span/>", {
      class: "param-value",
      id: this.id("ringvalue"),
      text: "#"
    }).appendTo(this.hid("ring-param"));
    $("<button/>", {
      class: "rotate-right",
      id: this.id("ringdown"),
      html: "&#8634;"
    }).appendTo(this.hid("ring-param"));
    $(this.hid("ringup")).click({
        controller: this.controller,
        side: this.side,
        value: +1
      },
      changeRingClick);
    $(this.hid("ringdown")).click({
        controller: this.controller,
        side: this.side,
        value: -1
      },
      changeRingClick);

    this.changeSelector(initial);
  }

  RotorView.prototype.changeTo = function (choice) {
    this.controller.changeRotor(this.side, choice);
  }

  RotorView.prototype.changeSelector = function (choice) {
    HtmlUtil.changeSelector(this, this.hid("choice" + choice));
  }

  RotorView.prototype.refreshStart = function (value) {
    $(this.hid("startvalue")).text(value);
  }

  RotorView.prototype.refreshRing = function (value) {
    $(this.hid("ringvalue")).text(value);
  }

  RotorView.prototype.getName = function () {
    if (this.side == 0) {
      return "Left Rotor";
    } else if (this.side == 1) {
      return "Middle Rotor";
    } else if (this.side == 2) {
      return "Right Rotor";
    }
  }

  RotorView.prototype.id = function (name) {
    return name + this.side;
  }

  RotorView.prototype.hid = function (name) {
    return "#" + this.id(name);
  }

  /* Plugboard View */

  function addPlugClick(event) {
    var values = event.data.view.getEntriesValue();
    if (!values["error"]) {
      event.data.view.addPlug(values["entry1"], values["entry2"]);
      if (event.data.view.controller.hasMaximumPlugboardConnection()) {
        event.data.view.disableAddButton();
      }
    }
  }

  function PlugboardView(controller) {
    this.itemGenerator = 0;
    this.controller = controller;
    $("<ul/>", {
      id: "plugboard-list"
    }).appendTo("#plugboard-container");
    $("<div/>", {
      id: "plugboard-adder"
    }).appendTo("#plugboard-container");

    $("<div/>", {
      id: "add-entries"
    }).appendTo("#plugboard-adder");
    $("<textarea/>", {
      id: "entry-one",
      maxlength: 1
    }).appendTo("#add-entries");
    $("<textarea/>", {
      id: "entry-two",
      maxlength: 1
    }).appendTo("#add-entries");
    $("<button/>", {
      id: "add-button",
      text: this.getAddButtonName()
    }).appendTo("#plugboard-adder");
    $("#add-button").click({
      view: this
    }, addPlugClick);
  }

  PlugboardView.prototype.addPlug = function (entry1, entry2) {
    this.controller.addPlugboardConnection(entry1, entry2);
    $("<div/>", {
      class: "add-item",
      id: "item" + this.itemGenerator
    }).appendTo("#plugboard-list");
    $("<div/>", {
      class: "cross-panel",
      html: "<div class='cross'>&#x274c;</div>"
    }).appendTo("#item" + this.itemGenerator);
    $("<span/>", {
      html: entry1.toUpperCase() + " &#8961; " + entry2.toUpperCase()
    }).appendTo("#item" + this.itemGenerator);
    $("#item" + this.itemGenerator).click({
      view: this
    }, function (event) {
      $(this).remove();
      event.data.view.controller.removePlugboardConnection(entry1, entry2);
      if (!event.data.view.controller.hasMaximumPlugboardConnection()) {
        event.data.view.enableAddButton();
        event.data.view.refreshAddButton();
      }
    });
    this.refreshAddButton();
    this.itemGenerator++;
  }

  PlugboardView.prototype.getEntriesValue = function () {
    this.unshowError("#entry-one");
    this.unshowError("#entry-two");
    var values = {};
    var entry1 = this.getEntry("#entry-one");
    var entry2 = this.getEntry("#entry-two");
    values["error"] = true;
    if (entry1 == undefined) {
      this.showError("#entry-one");
    }
    if (entry2 == undefined) {
      this.showError("#entry-two");
    }
    if (entry1 != undefined && entry2 != undefined) {
      values["error"] = false;
      values["entry1"] = entry1;
      values["entry2"] = entry2;
      this.cleanEntry("#entry-one");
      this.cleanEntry("#entry-two");

    }
    return values;
  }

  PlugboardView.prototype.getEntry = function (entryId) {
    var value = $(entryId).val();
    if (CharUtil.isAlpha(value) && !this.controller.isPlugboardUsed(value)) {
      return value;
    } else {
      return undefined;
    }
  }

  PlugboardView.prototype.showError = function (entryId) {
    $(entryId).css({
      borderColor: "rgb(199, 0, 0)"
    });
  }

  PlugboardView.prototype.unshowError = function (entryId) {
    $(entryId).css({
      borderColor: "#004d95"
    });
  }

  PlugboardView.prototype.cleanEntry = function (entryId) {
    $(entryId).val("");
  }

  PlugboardView.prototype.getAddButtonName = function () {
    return "Add to plugboard (" + this.controller.getRemainingConnection() + ")";
  }

  PlugboardView.prototype.refreshAddButton = function () {
    $("#add-button").text(this.getAddButtonName());
  }

  PlugboardView.prototype.disableAddButton = function () {
    $("#entry-one").prop("disabled", true);
    $("#entry-two").prop("disabled", true);
    $("#add-button").prop("disabled", true);
  }
  PlugboardView.prototype.enableAddButton = function () {
    $("#entry-one").prop("disabled", false);
    $("#entry-two").prop("disabled", false);
    $("#add-button").prop("disabled", false);
  }

  /* Input View */

  function inputChangeEvent(event) {
    var controller = event.data.controller;
    var view = event.data.view;
    controller.handleInput();
  }


  function inputDownEvent(event) {
    var controller = event.data.controller;
    var view = event.data.view;
    var start = view.getSelectionStart();
    var end = view.getSelectionEnd();
    if (KeyCode.isBackspace(event.which) && start == end) {
      start--;
    }
    controller.setStart(start);
    controller.setBeforeBlock(view.getLastBlock(start));

  }

  function inputPasteEvent(event) {
    var view = event.data.view;
    MachineController.log("NOT IMPLEMENTED > <PASTING NOT IMPLEMENTED>");
  }

  function InputView(controller) {
    this.controller = controller;

    $("<div/>", {
      id: "input-toolbar"
    }).appendTo("#input-container");
    $("<div/>", {
      id: "input-menu"
    }).appendTo("#input-toolbar");
    $("<div/>", {
      id: "input-title"
    }).appendTo("#input-toolbar");
    $("<button/>", {
      html: "PASTE",
      id: "inputpaste"
    }).appendTo("#input-menu");
    $("<span/>", {
      text: "Message to crypt"
    }).appendTo("#input-title");
    $("<textarea/>", {
      id: "inputarea",
      text: ""
    }).appendTo("#input-container");
    $("#inputpaste").click({
      view: this
    }, inputPasteEvent);


    $("#inputarea").keydown({
      controller: this.controller,
      view: this
    }, inputDownEvent);
    $("#inputarea").mousedown({
      controller: this.controller,
      view: this
    }, inputDownEvent);
    //$('#inputarea').bind('paste', {test:this}, function(event){console.log('this actually paste' + event.data.test.getSelectionStart())});
    $('#inputarea').bind('input', {
        controller: this.controller,
        view: this
      },
      inputChangeEvent);


  }

  InputView.prototype.getContent = function () {
    return $("#inputarea").val();
  }

  InputView.prototype.setContent = function (content) {
    return $("#inputarea").val(content);
  }

  InputView.prototype.addContent = function (content) {
    this.setContent(this.getContent() + content);
  }

  InputView.prototype.getSize = function () {
    return this.getContent().length;
  }

  InputView.prototype.getCharAt = function (index) {
    return this.getContent().charAt(index);
  }

  InputView.prototype.getSelectionStart = function () {
    return $("#inputarea")[0].selectionStart;
  }

  InputView.prototype.getSelectionEnd = function () {
    return $("#inputarea")[0].selectionEnd;
  }
  InputView.prototype.getBlock = function (start, end) {
    return this.getContent().substr(start, end);
  }

  InputView.prototype.getLastBlock = function (start) {
    return this.getBlock(start, this.getSize());
  }



  /* Output View */

  function outputCopyEvent(event) {
    var controller = event.data.controller;
    MachineController.log("NOT IMPLEMENTED > outputCopyEvent");
  }

  function outputSelectEvent(event) {
    var controller = event.data.controller;
    MachineController.log("NOT IMPLEMENTED > outputSelectEvent");
  }

  function OutputView(controller) {
    this.controller = controller;
    $("<div/>", {
      id: "output-toolbar"
    }).appendTo("#output-container");
    $("<div/>", {
      id: "output-menu"
    }).appendTo("#output-toolbar");
    $("<div/>", {
      id: "output-title"
    }).appendTo("#output-toolbar");
    $("<button/>", {
      html: "COPY",
      id: "outputcopy"
    }).appendTo("#output-menu");
    $("<button/>", {
      html: "SELECT",
      id: "outputselect"
    }).appendTo("#output-menu");
    $("<span/>", {
      text: "Encrypted message"
    }).appendTo("#output-title");
    $("<textarea/>", {
      id: "outputarea",
      text: ""
    }).appendTo("#output-container");
    $("#outputarea").prop("readonly", true);
    $("#outputcopy").click({
      controller: this.controller
    }, outputCopyEvent);
    $("#outputselect").click({
      controller: this.controller
    }, outputSelectEvent);

  }

  OutputView.SPACE_TAG = " ";

  OutputView.prototype.removeFrom = function (index) {
    var content = this.getContent();
    var removed = StringUtil.removeSeq(content, index, this.getSize());
    this.setContent(removed);
  }

  OutputView.prototype.getContent = function () {
    return $("#outputarea").val();
  }

  OutputView.prototype.setContent = function (content) {
    return $("#outputarea").val(content);
  }

  OutputView.prototype.addContent = function (content) {
    this.setContent(this.getContent() + content);
  }

  OutputView.prototype.addSpace = function () {
    this.addContent(OutputView.SPACE_TAG);
  }

  OutputView.prototype.getSize = function () {
    return this.getContent().length;
  }

  /* UtilityHandler */

  function UtilityHandler(controller) {
    this.controller = controller;
    this.rotorViewList = {};
    this.reflectorView = new ReflectorView(this.controller, this.controller.getActiveReflectorName());
    this.createRotorView(Machine.LEFT_ROTOR);
    this.createRotorView(Machine.MIDDLE_ROTOR);
    this.createRotorView(Machine.RIGHT_ROTOR);
    this.plugboardView = new PlugboardView(this.controller);
    this.inputView = new InputView(this.controller);
    this.outputView = new OutputView(this.controller);

  }

  UtilityHandler.log = function (message) {
    if (LOG_ENIGMA) {
      console.log("[UtilityHandler] " + message + ".");
    }
  }


  UtilityHandler.prototype.createRotorView = function (side) {
    var rotorView = new RotorView(this.controller, side, this.controller.getRotorName(side));
    rotorView.refreshStart(this.controller.getRotorStart(side));
    rotorView.refreshRing(this.controller.getRotorRing(side));
    this.rotorViewList[side] = (rotorView);
  }

  UtilityHandler.prototype.changeReflectorSelector = function (name) {
    UtilityHandler.log("changing reflector selector");
    this.reflectorView.changeSelector(name);
  }

  UtilityHandler.prototype.changeRotor = function (side, name) {
    this.rotorViewList[side].changeSelector(name);
    this.rotorViewList[side].refreshStart(this.controller.getRotorStart(side));
    this.rotorViewList[side].refreshRing(this.controller.getRotorRing(side));
  }

  UtilityHandler.prototype.refreshStart = function (side, start) {
    this.rotorViewList[side].refreshStart(start);
  }

  UtilityHandler.prototype.refreshRing = function (side, ring) {
    this.rotorViewList[side].refreshRing(ring);
  }

  UtilityHandler.prototype.getLastInputBlock = function (index) {
    return this.inputView.getLastBlock(index);
  }

  UtilityHandler.prototype.addOutputContent = function (content) {
    this.outputView.addContent(content);
  }

  UtilityHandler.prototype.addInputContent = function (content) {
    this.inputView.addContent(content);
  }

  UtilityHandler.prototype.removeFromOutput = function (index) {
    this.outputView.removeFrom(index);
  }

  UtilityHandler.prototype.refreshParameters = function (starts, rings) {
    var sideList = this.controller.getSideList();
    for (var i = 0; i < sideList.length; i++) {
      this.rotorViewList[sideList[i]].refreshStart(starts[i]);
      this.rotorViewList[sideList[i]].refreshRing(rings[i]);
    }
  }

  /* Keyboard */

  function Keyboard() {

  }

  Keyboard.NUMBEROFLINE = 3;
  Keyboard.LINES = [["Q", "W", "E", "R", "T", "Z", "U", "I", "O"],
                   ["A", "S", "D", "F", "G", "H", "J", "K"],
                   ["P", "Y", "X", "C", "V", "B", "N", "M", "L"]];


  Keyboard.prototype.buildKeyboard = function () {
    for (var i = 0; i < Keyboard.NUMBEROFLINE; i++) {
      this.buildLine(i);
    }
  }

  Keyboard.prototype.buildLine = function (lineNumber) {
    $("<div/>", {
      class: "keyboard-line" + " " + "line" + lineNumber + (lineNumber == Keyboard.NUMBEROFLINE - 1 ? "" : " keyboard-line-" + this.getType()),
      id: this.id("line" + lineNumber)
    }).appendTo(this.getKeyboardContainerId());
    for (var i in Keyboard.LINES[lineNumber]) {
      $("<span/>", {
        class: this.getType() + "-key",
        id: this.id("key" + Keyboard.LINES[lineNumber][i]),
        html: Keyboard.LINES[lineNumber][i],
      }).appendTo(this.hid("line" + lineNumber));
    }
  }

  Keyboard.prototype.getKeyboardContainerId = function () {
    return "#machine-" + this.getType();
  }

  Keyboard.prototype.id = function (name) {
    return this.getType() + name;
  }

  Keyboard.prototype.hid = function (name) {
    return "#" + this.getType() + name;
  }

  /* InputKeyboard */

  function inputKeyboardMouseDownEvent(event) {
    event.data.handler.keyDown(event.data.char);
  }

  function inputKeyboardMouseUpEvent(event) {
    event.data.handler.keyUp();
  }

  function InputKeyboard(handler) {
    this.handler = handler;
    this.buildKeyboard();
    this.buildKeysEvent();
  }

  InputKeyboard.prototype = new Keyboard();

  InputKeyboard.prototype.buildKeysEvent = function () {
    var char;
    for (var lineNumber = 0; lineNumber < Keyboard.NUMBEROFLINE; lineNumber++) {
      for (var i in Keyboard.LINES[lineNumber]) {
        char = Keyboard.LINES[lineNumber][i];
        $(this.hid("key" + char)).mousedown({
          char: char,
          handler: this.handler
        }, inputKeyboardMouseDownEvent);
      }
    }
    $("#graphic").mouseup({
      handler: this.handler
    }, inputKeyboardMouseUpEvent);
    /*$("#graphic").keydown(inputKeyboardKeyDown);
    $("#graphic").keyup(inputKeyboardKeyUp);*/
  }

  InputKeyboard.prototype.getType = function () {
    return "input";
  }

  /* OutputKeyboard */

  function OutputKeyboard(handler) {
    this.handler = handler;
    this.buildKeyboard();
  }

  OutputKeyboard.prototype = new Keyboard();

  OutputKeyboard.prototype.getType = function () {
    return "output";
  }

  OutputKeyboard.prototype.enable = function (char) {
    $(this.hid("key" + char)).addClass("output-key-active");
  }

  OutputKeyboard.prototype.disable = function (char) {
    $(this.hid("key" + char)).removeClass("output-key-active");
  }

  /* RotorComponent */

  function wheelUpEvent(event) {
    var component = event.data.component;
    component.controller.changeStart(component.side, +1);
    component.rotateWheel();
    // FIXME (info) wheel rotation is here because need focus to calculte tooth size (controller refresh even when not focus on graphic tab)
  }

  function wheelDownEvent(event) {
    var component = event.data.component;
    component.controller.changeStart(component.side, -1);
    component.rotateWheel();
    // FIXME (info) wheel rotation is here because need focus to calculte tooth size (controller refresh even when not focus on graphic tab)
  }

  function RotorComponent(controller, side) {
    this.controller = controller;
    this.side = side;
    this.state = RotorComponent.DEFAULTSTATE;

    var component, frame, wheel;
    frame = $("<div/>", {
      class: "rotor-frame",
      id:this.id("frame")
    });
    wheel = $("<div/>", {
      class: "rotor-wheel",
      id: this.id("wheel")
    });
    component = $("<div/>", {
      class: "rotor-component",
    });
    frame.appendTo(component);
    wheel.appendTo(component);
    component.appendTo("#machine-components");
    this.buildWheelState(this.state);
  }

  RotorComponent.NUMBEROFROTOR = 3;
  RotorComponent.NUMBEROFTOOTH = 5;
  RotorComponent.DEFAULTSTATE = 0;

  RotorComponent.prototype.buildWheelState = function (state) {
    var wheelHeight = $(this.hid("wheel")).outerHeight();
    if (state  == 0) {
      this.buildWheelState0(wheelHeight, state);
    } else if (state == 1) {
      this.buildWheelState1(wheelHeight, state);
    }
  }

  RotorComponent.prototype.buildWheelState0 = function (wheelHeight, state) {
    var toothHeight = Math.floor(wheelHeight / RotorComponent.NUMBEROFTOOTH);
    var $tooth;
    for (var i = 0; i < RotorComponent.NUMBEROFTOOTH; i++) {
      $tooth = this.createTooth(toothHeight, state,
        this.deduceDirection(i, RotorComponent.NUMBEROFTOOTH));
      $tooth.appendTo(this.hid("wheel"));
    }
  }

  RotorComponent.prototype.buildWheelState1 = function (wheelHeight, state) {
    var toothHeight = Math.floor(wheelHeight / RotorComponent.NUMBEROFTOOTH);
    var halfToothHeight = Math.floor(toothHeight / 2);
    var $tooth;
    $tooth = this.createTooth(halfToothHeight, state, "up");
    $tooth.appendTo(this.hid("wheel"));
    for (var i = 0; i < RotorComponent.NUMBEROFTOOTH - 1; i++) {
      $tooth = this.createTooth(toothHeight, state,
        this.deduceDirection(i, RotorComponent.NUMBEROFTOOTH - 1));
      $tooth.appendTo(this.hid("wheel"));
    }
    $tooth = this.createTooth(halfToothHeight, state, "down");
    $tooth.appendTo(this.hid("wheel"));
  }

  RotorComponent.prototype.deduceDirection = function (index, numberOfTooth) {
    var halfFloor = Math.floor(numberOfTooth / 2)
    if (numberOfTooth % 2 == 0 || index != halfFloor) {
      return index < halfFloor ? "up" : "down";
    }
    return undefined;
  }

  RotorComponent.prototype.createTooth = function (height, state, direction) {
    var $tooth;
    $tooth = $("<div/>", {
      class: "rotor-tooth tooth-state-" + state
    });
    if (direction != undefined) {
      $tooth.css({
        cursor: "pointer"
      });
      $tooth.click({
        component: this
      }, direction == "up" ? wheelUpEvent : wheelDownEvent);
    }
    $tooth.outerHeight(height);
    return $tooth;
  }

  RotorComponent.prototype.cleanWheel = function(){
    $(this.hid("wheel")).empty();
  }

  RotorComponent.prototype.rotateWheel = function(){
    this.state = (this.state+1) % 2;
    this.cleanWheel();
    this.buildWheelState(this.state);
  }

  RotorComponent.prototype.refreshFrame = function(char){
    $(this.hid("frame")).text(char);
  }

  RotorComponent.prototype.id = function (name) {
    return name + this.side;
  }

  RotorComponent.prototype.hid = function (name) {
    return "#" + this.id(name);
  }

  /* GraphicHandler */

  function GraphicHandler(controller) {
    this.controller = controller;
    this.rotorComponentList = {}
    this.createRotorComponent(Machine.LEFT_ROTOR);
    this.createRotorComponent(Machine.MIDDLE_ROTOR);
    this.createRotorComponent(Machine.RIGHT_ROTOR);
    this.outputKeyboard = new OutputKeyboard(this);
    this.inputKeyboard = new InputKeyboard(this);
    this.lastCryptedChar = undefined;

  }

  GraphicHandler.prototype.createRotorComponent = function (side) {
    var rotorComponent = new RotorComponent(this.controller, side);
    rotorComponent.refreshFrame(this.controller.getRotorStart(side));
    this.rotorComponentList[side] = (rotorComponent);
  }


  GraphicHandler.prototype.keyDown = function (char) {
    if (this.lastCryptedChar == undefined) {
      this.lastCryptedChar = this.controller.refreshCrypt(char);
      this.outputKeyboard.enable(this.lastCryptedChar);
    }
  }

  GraphicHandler.prototype.keyUp = function () {
    if (this.lastCryptedChar != undefined) {
      this.outputKeyboard.disable(this.lastCryptedChar);
      this.lastCryptedChar = undefined;
    }
  }

  GraphicHandler.prototype.refreshFrame = function(side, char){
    this.rotorComponentList[side].refreshFrame(char);
  }


  /* MachineController */

  function MachineController() {

    this.machine = new Machine("Enigma 1",
      MachineController.MAXIMUM_PLUGITEM);
    this.plugItemCounter = 0;
    this.startIndex = -1;
    this.beforeBlock = "";
    this.utilityHandler = new UtilityHandler(this);
    this.graphicHandler = new GraphicHandler(this);

  }

  MachineController.MAXIMUM_PLUGITEM = 10;

  MachineController.log = function (message) {
    if (LOG_ENIGMA) {
      console.log("[MachineController] " + message + ".");
    }
  }

  MachineController.prototype.changeReflector = function (name) {
    MachineController.log("changeReflector(" + name + ")");
    this.machine.setActiveReflector(name);
    this.utilityHandler.changeReflectorSelector(name);
  }

  MachineController.prototype.changeRotor = function (side, name) {
    MachineController.log("changeRotor(" + side + ", " + name + ")");
    var old = this.getRotorName(side);
    this.machine.setRotorOnSide(side, name);
    this.utilityHandler.changeRotor(side, name);
    for (var otherSide in [Machine.LEFT_ROTOR, Machine.MIDDLE_ROTOR, Machine.RIGHT_ROTOR]) {
      if (side != otherSide && this.machine.getRotorOnSide(otherSide).getName() == name) {
        this.machine.setRotorOnSide(otherSide, old);
        this.utilityHandler.changeRotor(otherSide, old);
      }
    }
  }

  // FIXME to avoid conflict, |value| = 1
  MachineController.prototype.changeStart = function (side, value) {
    MachineController.log("changeStart(" + side + ", " + value + ")");
    var char = this.getRotorStart(side);
    var charCode = char.charCodeAt(0);
    if (value == 1 && charCode >= Rotor.CHARCODEMAXSET) {
      charCode = Rotor.CHARCODEMINSET;
    } else if (value == -1 && charCode <= Rotor.CHARCODEMINSET) {
      charCode = Rotor.CHARCODEMAXSET;
    } else {
      charCode += (value);
    }
    var newStart = String.fromCharCode(charCode);
    this.setRotorStart(side, newStart);
    this.utilityHandler.refreshStart(side, newStart);
    this.graphicHandler.refreshFrame(side, newStart);
  }

  // FIXME to avoid conflict, |value| = 1
  MachineController.prototype.changeRing = function (side, value) {
    MachineController.log("changeRing(" + side + ", " + value + ")");
    var char = this.getRotorRing(side);
    var charCode = char.charCodeAt(0);
    if (value == 1 && charCode >= Rotor.CHARCODEMAXSET) {
      charCode = Rotor.CHARCODEMINSET;
    } else if (value == -1 && charCode <= Rotor.CHARCODEMINSET) {
      charCode = Rotor.CHARCODEMAXSET;
    } else {
      charCode += (value);
    }
    var newRing = String.fromCharCode(charCode);
    this.setRotorRing(side, newRing);
    this.utilityHandler.refreshRing(side, newRing);
  }

  // FIXME Plugboard refreshing by the controller (not by itself)
  MachineController.prototype.addPlugboardConnection = function (entry1, entry2) {
    MachineController.log("addPlugboardConnection(" + entry1 + ", " + entry2 + ")");
    this.plugItemCounter++;
    this.machine.addPlugboardConnection(entry1, entry2);
  }

  MachineController.prototype.removePlugboardConnection = function (entry1, entry2) {
    MachineController.log("removePlugboardConnection(" + entry1 + ", " + entry2 + ")");
    this.plugItemCounter--;
    this.machine.removePlugboardConnection(entry1, entry2);
  }

  MachineController.prototype.isPlugboardUsed = function (char) {
    MachineController.log("isPlugboardUsed(" + char + ")");
    return this.machine.isPlugboardUsed(char);
  }

  MachineController.prototype.handleInput = function () {
    MachineController.log("handleInput().");
    this.reverse(this.getBeforeBlock());
    var block = this.utilityHandler.getLastInputBlock(this.startIndex);
    var cryptedBlock = this.crypt(block);
    this.utilityHandler.removeFromOutput(this.startIndex);
    this.utilityHandler.addOutputContent(cryptedBlock);
  }

  MachineController.prototype.reverse = function (block) {
    var counter = 0;
    for (var i = 0; i < block.length; i++) {
      if (CharUtil.isAlpha(block[i])) {
        counter++;
        this.machine.reverse(1);
        this.refreshParameters();
      }
    }
    MachineController.log("(?? DONE) NOT IMPLEMENTED > reversing: " + block + "; counter = " + counter);
  }

  MachineController.prototype.refreshCrypt = function (block) {
    var cryptedBlock = this.crypt(block);
    this.utilityHandler.addInputContent(block);
    this.utilityHandler.addOutputContent(cryptedBlock);
    return cryptedBlock;
  }

  MachineController.prototype.crypt = function (block) {
    var cryptedBlock = "";
    var crypted = "";
    for (var i = 0; i < block.length; i++) {
      if (CharUtil.isAlpha(block[i])) {
        crypted = this.machine.crypt(block[i]);
        cryptedBlock += CharUtil.isLowerCase(block[i]) ? crypted.toLowerCase() : crypted.toUpperCase();
        this.refreshParameters();
      } else {
        cryptedBlock += block[i];
      }
    }
    MachineController.log("(?? DONE) NOT IMPLEMENTED > crypt:" + block + " -> " + cryptedBlock);
    return cryptedBlock;
  }

  MachineController.prototype.setStart = function (index) {
    this.startIndex = index;
  }

  MachineController.prototype.getStart = function () {
    return this.startIndex;
  }

  MachineController.prototype.setBeforeBlock = function (block) {
    this.beforeBlock = block;
  }

  MachineController.prototype.getBeforeBlock = function () {
    return this.beforeBlock;
  }

  MachineController.prototype.hasMaximumPlugboardConnection = function () {
    return this.plugItemCounter == this.machine.getMaxCable();
  }

  MachineController.prototype.getRemainingConnection = function () {
    return this.machine.getMaxCable() - this.plugItemCounter;
  }

  MachineController.prototype.getRotors = function () {
    return this.machine.getRotors();
  }

  MachineController.prototype.getActiveReflectorName = function () {
    return this.machine.getActiveReflector().getName();
  }

  MachineController.prototype.getRotorName = function (side) {
    return this.machine.getRotorOnSide(side).getName();
  }

  MachineController.prototype.getRotorStart = function (side) {
    return this.machine.getRotorStart(side);
  }

  MachineController.prototype.getRotorRing = function (side) {
    return this.machine.getRotorRing(side);
  }

  MachineController.prototype.setRotorStart = function (side, start) {
    return this.machine.setRotorStart(side, start);
  }

  MachineController.prototype.setRotorRing = function (side, ring) {
    return this.machine.setRotorRing(side, ring);
  }

  MachineController.prototype.getSideList = function () {
    return [Machine.LEFT_ROTOR, Machine.MIDDLE_ROTOR, Machine.RIGHT_ROTOR];
  }

  MachineController.prototype.refreshParameters = function () {
    var starts = [];
    var rings = [];
    for (var side in this.getSideList()) {
      starts.push(this.getRotorStart(side));
      rings.push(this.getRotorRing(side));
    }
    this.utilityHandler.refreshParameters(starts, rings);
  }

  /* Main */

  function main(args) {
    var controller = new MachineController();
  }

  main();

});
