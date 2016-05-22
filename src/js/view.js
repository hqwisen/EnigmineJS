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
// FIXME bug in changerotor in graphics view

$(function () {
  "use strict";

  /* Event, Click */

  function changeReflectorEvent(event) {
    var controller = event.data.controller;
    controller.changeReflector(event.data.choice);
  }

  function changeRotorClick(event) {
    var side, choice, controller;
    side = event.data.side;
    choice = event.data.choice;
    controller = event.data.controller;
    controller.changeRotor(side, choice);
  }

  function changeStartClick(event) {
    var controller = event.data.controller;
    controller.changeStart(event.data.side, event.data.value);
  }

  function changeRingClick(event) {
    var controller = event.data.controller;
    controller.changeRing(event.data.side, event.data.value);
  }

  function addPlugClick(event) {
    var controller = event.data.controller;
    var view = event.data.view;
    var values = view.getEntriesValue();
    if (!values["error"]) {
      controller.addPlugboardConnection(values["entry1"], values["entry2"]);
    }
  }

  function removePlugClick(event) {
    var entry1 = event.data.entry1;
    var entry2 = event.data.entry2;
    var controller = event.data.controller;
    var view = event.data.view;
    controller.removePlugboardConnection(entry1, entry2);
  }

  function outputCopyEvent(event) {
    var controller = event.data.controller;
    MachineController.log("NOT IMPLEMENTED > outputCopyEvent");
  }

  function outputSelectEvent(event) {
    var controller = event.data.controller;
    MachineController.log("NOT IMPLEMENTED > outputSelectEvent");
  }

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

  function openMachineEvent(event) {
    event.data.handler.openMachine();
  }

  function closeMachineEvent(event) {
    event.data.handler.closeMachine();
  }

  /* ReflectorView */

  function ReflectorView(controller, initial) {
    this.controller = controller;
    this.lastId = undefined;

    $("<div/>", {
      class: "rotor",
      id: this.id("reflector")
    }).appendTo("#reflectors-container");
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
        controller: this.controller,
        choice: "B"
      },
      changeReflectorEvent);
    $("<button/>", {
      id: this.id("choiceC"),
      text: "C"
    }).appendTo(this.hid("reflector-choice"));
    $(this.hid("choiceC")).click({
        controller: this.controller,
        choice: "C"
      },
      changeReflectorEvent);
    /* Rotor parameters */
    /*
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
      html: "#"
    }).appendTo(this.hid("start-param"));
    $("<span/>", {
      class: "param-value",
      id: this.id("startvalue"),
      text: "#"
    }).appendTo(this.hid("start-param"));
    $("<button/>", {
      class: "rotate-right",
      id: this.id("startdown"),
      html: "#"
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
      html: "#"
    }).appendTo(this.hid("ring-param"));
    $("<span/>", {
      class: "param-value",
      id: this.id("ringvalue"),
      text: "#"
    }).appendTo(this.hid("ring-param"));
    $("<button/>", {
      class: "rotate-right",
      id: this.id("ringdown"),
      html: "#"
    }).appendTo(this.hid("ring-param"));
    $(this.hid("ringup")).attr("disabled", true);
    $(this.hid("ringdown")).attr("disabled", true);*/


    this.changeSelector(initial);
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
          controller: this.controller,
          side: this.side,
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

  function PlugboardView(controller) {
    this.itemGenerator = 0;
    this.controller = controller;
    this.items = {};
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
      view: this,
      controller: this.controller
    }, addPlugClick);
  }

  PlugboardView.prototype.addPlug = function (entry1, entry2) {
    var item = $("<div/>", {
      class: "add-item",
      id: "item" + this.itemGenerator
    });
    item.appendTo("#plugboard-list");
    this.items[entry1 + entry2] = item;
    $("<div/>", {
      class: "cross-panel",
      html: "<div class='cross'>&#x274c;</div>"
    }).appendTo("#item" + this.itemGenerator);
    $("<span/>", {
      html: entry1.toUpperCase() + " &#8961; " + entry2.toUpperCase()
    }).appendTo("#item" + this.itemGenerator);
    $("#item" + this.itemGenerator).click({
      view: this,
      controller: this.controller,
      entry1: entry1,
      entry2: entry2
    }, removePlugClick);

    this.itemGenerator++;
  }

  PlugboardView.prototype.removePlug = function (entry1, entry2) {
    console.log("plugboard view remove " + entry1 + entry2);
    // FIXME bad conception of this.items
    if (this.items[entry1 + entry2] != undefined) {
      this.items[entry1 + entry2].remove();
      delete this.items[entry1 + entry2];
    } else {
      this.items[entry2 + entry1].remove();
      delete this.items[entry2 + entry1];
    }
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
   /* $("<button/>", {
      html: "PASTE",
      id: "inputpaste"
    }).appendTo("#input-menu");*/
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
    /*$("<button/>", {
      html: "COPY",
      id: "outputcopy"
    }).appendTo("#output-menu");
    $("<button/>", {
      html: "SELECT",
      id: "outputselect"
    }).appendTo("#output-menu");*/
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

  UtilityHandler.prototype.addPlug = function (char1, char2) {
    this.plugboardView.addPlug(char1, char2);
    this.plugboardView.refreshAddButton();
    if (this.controller.hasMaximumPlugboardConnection()) {
      this.plugboardView.disableAddButton();
    }

  }

  UtilityHandler.prototype.removePlug = function (char1, char2) {
    this.plugboardView.removePlug(char1, char2);
    this.plugboardView.refreshAddButton();
    if (!this.controller.hasMaximumPlugboardConnection()) {
      this.plugboardView.enableAddButton();
    }
  }

  /* Keyboard */

  function Keyboard() {
    this.$keys = {};
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
      var char = Keyboard.LINES[lineNumber][i];
      var element = $("<span/>", {
        class: this.getType() + "-key",
        id: this.id("key" + char),
        html: Keyboard.LINES[lineNumber][i],
      });
      this.$keys[char] = element;
      element.appendTo(this.hid("line" + lineNumber));
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
    $(this.hid("key" + char)).addClass("output-" + this.getKeyType() + "-active");
  }

  OutputKeyboard.prototype.disable = function (char) {
    $(this.hid("key" + char)).removeClass("output-" + this.getKeyType() + "-active");
  }

  OutputKeyboard.prototype.getKeyType = function () {
    return this.handler.isOpen() ? "light" : "key";
  }

  OutputKeyboard.prototype.open = function () {
    console.log("opening output keyboard");
    $("#machine-output").removeClass("machine-output-close");
    $("#machine-output").addClass("machine-output-open");
    this.showLights();
  }

  OutputKeyboard.prototype.close = function () {
    console.log("closing output keyboard");
    $("#machine-output").removeClass("machine-output-open");
    $("#machine-output").addClass("machine-output-close");
    this.showKeys();
  }

  OutputKeyboard.prototype.showLights = function () {
    for (var char in this.$keys) {
      this.$keys[char].removeClass("output-key");
      this.$keys[char].addClass("output-light");
      this.$keys[char].html("");
    }
  }

  OutputKeyboard.prototype.showKeys = function () {
    for (var char in this.$keys) {
      this.$keys[char].removeClass("output-light");
      this.$keys[char].addClass("output-key");
      this.$keys[char].html(char);
    }
  }

  /* ReflectorComponent */

  function ReflectorComponent(controller) {
    this.controller = controller;
    this.currentChoice = this.controller.getActiveReflectorName();
    var reflector = $("<div/>", {
      id: "reflector-component"
    });
    $("<span/>", {
      id: "reflector-component-name",
      text: this.currentChoice
    }).appendTo(reflector);
    reflector.appendTo("#machine-components");
  }

  ReflectorComponent.prototype.open = function () {
    console.log("opening reflector component");
    $("#reflector-component").removeClass("reflector-component-close");
    $("#reflector-component").addClass("reflector-component-open");
    $("#reflector-component").click({
      controller: this.controller,
      choice: this.getNextChoice()
    }, changeReflectorEvent);
  }

  ReflectorComponent.prototype.close = function () {
    console.log("closing reflector component");
    $("#reflector-component").removeClass("reflector-component-open");
    $("#reflector-component").addClass("reflector-component-close");
    $("#reflector-component").off('click');
  }

  ReflectorComponent.prototype.getNextChoice = function () {
    if (this.currentChoice == "B") {
      return "C";
    }
    if (this.currentChoice == "C") {
      return "B";
    }
  }

  ReflectorComponent.prototype.changeReflector = function (name) {
    this.currentChoice = name;
    $("#reflector-component-name").text(name);
    $("#reflector-component").click({
      controller: this.controller,
      choice: this.getNextChoice()
    }, changeReflectorEvent);
  }

  /* RotorComponent */

  function RotorComponent(controller, side) {
    this.controller = controller;
    this.side = side;
    this.state = RotorComponent.DEFAULTSTATE;
    this.previousFrame = undefined;
    this.letterList = [];

    var component, letters, separator0, separator1, wheel, name;
    letters = this.buildLetters();
    wheel = $("<div/>", {
      class: "rotor-wheel",
      id: this.id("wheel")
    });
    separator0 = $("<div/>", {
      class: "rotor-separator",
      id: this.id("separator0")
    });
    separator1 = $("<div/>", {
      class: "rotor-separator",
      id: this.id("separator1")
    });
    name = this.buildName();
    component = $("<div/>", {
      class: "rotor-component",
      id: this.id("component")
    });
    separator0.appendTo(component);
    name.appendTo(letters);
    letters.appendTo(component);
    separator1.appendTo(component);
    wheel.appendTo(component);
    component.appendTo("#machine-components");
    this.buildWheelState(this.state);
  }

  RotorComponent.NUMBEROFROTOR = 3;
  RotorComponent.NUMBEROFTOOTH = 5;
  // NumberOfLetter must be odd
  RotorComponent.NUMBEROFLETTER = 5;
  RotorComponent.FRAMEFONTSIZE = 25;
  RotorComponent.DEFAULTSTATE = 0;

  RotorComponent.frameIndex = function () {
    return Math.floor(RotorComponent.NUMBEROFLETTER / 2);
  }

  RotorComponent.prototype.buildName = function () {

    var element = $("<div/>", {
      class: "droping-menu",
      id: this.id("droping-menu")
    });
    var nameElement = $("<a/>", {
      class: "rotor-component-name",
      id: this.id("component-name"),
      text: this.controller.getRotorName(this.side)
    });
    nameElement.attr("href", "#");
    var rotors = this.controller.getRotors();
    nameElement.appendTo(element);
    for (var name in rotors) {
      var choice = $("<a/>", {
        class: "droping-item",
        text: name
      });
      choice.click({
        side: this.side,
        controller: this.controller,
        name:name
      }, function (e) {
        var name = e.data.name;
        var side = e.data.side;
        e.data.controller.changeRotor(side, name);
      });
      element.append(choice);
    }
    return element;
  }


  RotorComponent.prototype.buildLetters = function () {
    // Note : build manually 5 (numberOfLetter) letters
    var letters = $("<div/>", {
      class: "rotor-letters",
      id: this.id("letters")
    });
    for (var i = 0; i < RotorComponent.NUMBEROFLETTER; i++) {
      this.letterList.push(this.buildLetter(i));
    }
    this.letterList[0].css({
      fontSize: "15px",
      height: "15%"
    });
    this.letterList[1].css({
      fontSize: "20px",
      height: "22.5%"
    });
    this.letterList[2].css({
      fontSize: "25px",
      height: "25%"
    });
    this.letterList[3].css({
      fontSize: "20px",
      height: "22.5%"
    });
    this.letterList[4].css({
      fontSize: "15px",
      height: "15%"
    });
    for (var i = 0; i < RotorComponent.NUMBEROFLETTER; i++) {
      this.letterList[i].appendTo(letters);
    }
    return letters;
  }

  RotorComponent.prototype.buildLetter = function (index) {
    var letter = $("<div/>", {
      class: "rotor-letter",
      id: this.id("letter" + index),
      text: "#"
    });
    return letter;
  }

  RotorComponent.prototype.buildWheelState = function (state) {
    var wheelHeight = $(this.hid("wheel")).outerHeight();
    if (state == 0) {
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

  RotorComponent.prototype.cleanWheel = function () {
    $(this.hid("wheel")).empty();
  }

  RotorComponent.prototype.rotateWheel = function () {
    this.state = (this.state + 1) % 2;
    this.cleanWheel();
    this.buildWheelState(this.state);
  }

  RotorComponent.prototype.refreshWheel = function () {
    if (this.previousFrame != this.frameVal()) {
      this.rotateWheel();
    }
  }

  RotorComponent.prototype.refreshName = function (name) {
    $(this.hid("component-name")).text(name);
  }

  // NOTE (FIXME): refreshFrame is called every crypt,
  // even if the rotor does not change (see controller.refreshParameters())
  RotorComponent.prototype.refreshFrame = function (char) {
    this.previousFrame = this.frameVal();
    this.getFrameElement().text(char);
    $(this.hid("letter0")).text(CharUtil.getShiftedChar(char, -2));
    $(this.hid("letter1")).text(CharUtil.getShiftedChar(char, -1));
    $(this.hid("letter3")).text(CharUtil.getShiftedChar(char, +1));
    $(this.hid("letter4")).text(CharUtil.getShiftedChar(char, +2))
  }

  RotorComponent.prototype.frameVal = function (char) {
    return this.getFrameElement().text();
  }

  RotorComponent.prototype.getFrameElement = function () {
    return this.letterList[RotorComponent.frameIndex()];
  }

  RotorComponent.prototype.open = function () {
    console.log("opening rotor component " + this.side);
    this.openPart("component");
    this.showLetters();
    this.openPart("separator0");
    this.openPart("separator1");
    this.showName();
  }

  RotorComponent.prototype.close = function () {
    console.log("closing rotor component " + this.side);
    this.closePart("component");
    this.hideLetters();
    this.closePart("separator0");
    this.closePart("separator1");
    this.unshowName();
  }

  RotorComponent.prototype.showName = function () {
    $(this.hid("droping-menu")).removeClass("close-class");
    $(this.hid("droping-menu")).addClass("open-class");
  }

  RotorComponent.prototype.unshowName = function () {
    $(this.hid("droping-menu")).removeClass("open-class");
    $(this.hid("droping-menu")).addClass("close-class");
  }

  RotorComponent.prototype.showLetters = function () {
    $(this.hid("letters")).addClass("rotor-letters-open");
    this.getFrameElement().removeClass("rotor-frame-close");
    this.getFrameElement().addClass("rotor-frame-open");
    for (var i = 0; i < RotorComponent.NUMBEROFLETTER; i++) {
      if (this.letterList[i] != this.getFrameElement()) {
        this.letterList[i].removeClass("rotor-letter-close");
        this.letterList[i].addClass("rotor-letter-open");
      }
    }
  }

  RotorComponent.prototype.hideLetters = function () {
    $(this.hid("letters")).removeClass("rotor-letters-open");
    this.getFrameElement().removeClass("rotor-frame-open");
    this.getFrameElement().addClass("rotor-frame-close");
    for (var i = 0; i < RotorComponent.NUMBEROFLETTER; i++) {
      if (this.letterList[i] != this.getFrameElement()) {
        this.letterList[i].removeClass("rotor-letter-open");
        this.letterList[i].addClass("rotor-letter-close");
      }
    }
  }

  RotorComponent.prototype.openPart = function (part) {
    $(this.hid(part)).removeClass("rotor-" + part + "-close");
    $(this.hid(part)).addClass("rotor-" + part + "-open");
  }

  RotorComponent.prototype.closePart = function (part) {
    $(this.hid(part)).removeClass("rotor-" + part + "-open");
    $(this.hid(part)).addClass("rotor-" + part + "-close");
  }

  RotorComponent.prototype.id = function (name) {
    return name + this.side;
  }

  RotorComponent.prototype.hid = function (name) {
    return "#" + this.id(name);
  }

  /* Plugboard Component */

  function openPlugboardEvent(event) {
    var handler = event.data.handler;
    handler.openPlugboard();
  }

  function closePlugboardEvent(event) {
    var handler = event.data.handler;
    handler.closePlugboard();
  }

  function portMouseDown(event) {
    var handler = event.data.handler;
    var char = event.data.char;
    switch (event.which) {
    case 1: // left click
      handler.portDown(char);
      break;
    case 3: // right click
      handler.portRemove(char);
      break;
    }
  }


  function portMouseUp(event) {
    var handler = event.data.handler;
    var char = event.data.char;
    switch (event.which) {
    case 1: // left click
      handler.portUp(char);
      break;
    }
  }

  function Port(handler, char) {
    this.handler = handler;
    this.plugged = false;
    this.active = false;
    this.element = $("<span/>", {
      class: "port",
      id: "port" + char,
      html: "O<br/>O"
    });
    this.element.mouseup({
      handler: this.handler,
      char: char
    }, portMouseUp);
    this.element.mousedown({
      handler: this.handler,
      char: char
    }, portMouseDown);
    this.element.on("contextmenu", function () {
      return false;
    });
  }

  Port.prototype.plug = function () {
    this.plugged = true;
    this.element.addClass("port-plugged");
  }

  Port.prototype.unplug = function () {
    this.deactivate();
    this.plugged = false;
    this.element.removeClass("port-plugged");
  }

  Port.prototype.isPlugged = function () {
    return this.plugged;
  }

  Port.prototype.activate = function () {
    if (this.plugged) {
      this.active = true;
      this.element.addClass("port-plugged-active");
    }
  }

  Port.prototype.deactivate = function () {
    if (this.plugged) {
      this.active = false;
      this.element.removeClass("port-plugged-active");
    }
  }

  Port.prototype.isActivate = function () {
    return this.active;
  }

  Port.prototype.disable = function () {
    this.element.addClass("port-not-allowed");
  }

  Port.prototype.enable = function () {
    this.element.removeClass("port-not-allowed");
  }

  Port.prototype.getElement = function () {
    return this.element;
  }

  function PlugboardComponent(handler) {
    this.handler = handler;
    this.ports = {};
    $("#cables-close").click({
      handler: this.handler
    }, closePlugboardEvent);
    $("#machine-cables").on("contextmenu", function () {
      return false;
    });
    this.build();
    this.close();
  }

  PlugboardComponent.prototype.open = function () {
    console.log("opening plugboard component");
    $("#machine-cables").removeClass("close-class");
    $("#machine-cables").addClass("open-class");

  }

  PlugboardComponent.prototype.close = function () {
    console.log("closing plugboard component");
    $("#machine-cables").removeClass("open-class");
    $("#machine-cables").addClass("close-class");
    $("#machine-plugboard").click({
      handler: this.handler
    }, openPlugboardEvent);
  }

  PlugboardComponent.prototype.build = function () {
    for (var i = 0; i < Keyboard.NUMBEROFLINE; i++) {
      this.buildLine(i);
    }
  }

  PlugboardComponent.prototype.buildLine = function (lineNumber) {
    $("<div/>", {
      class: "keyboard-line" + " " + "line" + lineNumber,
      id: this.id("line" + lineNumber)
    }).appendTo("#machine-cables");
    for (var i in Keyboard.LINES[lineNumber]) {
      var char = Keyboard.LINES[lineNumber][i];
      var portContainer = $("<div/>", {
        class: "portcontainer"
      });
      var charElement = $("<span/>", {
        class: "portchar",
        text: char
      });

      var port = new Port(this.handler, char);
      this.ports[char] = port;
      charElement.appendTo(portContainer);
      port.getElement().appendTo(portContainer);
      portContainer.appendTo(this.hid("line" + lineNumber));
    }
  }

  PlugboardComponent.prototype.clickOn = function (char) {
    if (this.ports[char].isActivate()) {
      this.ports[char].deactivate();
    } else {
      this.ports[char].activate();
    }
  }

  PlugboardComponent.prototype.addPlug = function (char1, char2) {
    this.addPlugOn(char1);
    this.addPlugOn(char2);
  }

  PlugboardComponent.prototype.removePlug = function (char1, char2) {
    this.removePlugOn(char1);
    this.removePlugOn(char2);
  }

  PlugboardComponent.prototype.addPlugOn = function (char) {
    var element = this.ports[char];
    this.ports[char].plug();
  }

  PlugboardComponent.prototype.removePlugOn = function (char) {
    var element = this.ports[char];
    this.ports[char].unplug();
  }

  PlugboardComponent.prototype.disable = function () {
    for (var char in this.ports) {
      if (!this.ports[char].isPlugged()) {
        this.ports[char].disable();
      }
    }
  }

  PlugboardComponent.prototype.enable = function () {
    for (var char in this.ports) {
      this.ports[char].enable();
    }
  }



  PlugboardComponent.prototype.id = function (name) {
    return "plugboard" + name;
  }

  PlugboardComponent.prototype.hid = function (name) {
    return "#plugboard" + name;
  }

  /* GraphicHandler */


  function GraphicHandler(controller) {
    this.controller = controller;
    this.reflectorComponent = new ReflectorComponent(this.controller);
    this.rotorComponentList = {}
    this.currentActivePlug = undefined;
    this.currentSelectedPlug = undefined;
    this.createRotorComponent(Machine.LEFT_ROTOR);
    this.createRotorComponent(Machine.MIDDLE_ROTOR);
    this.createRotorComponent(Machine.RIGHT_ROTOR);
    this.outputKeyboard = new OutputKeyboard(this);
    this.inputKeyboard = new InputKeyboard(this);
    this.plugboadComponent = new PlugboardComponent(this);
    this.lastCryptedChar = undefined;
    this.currentMachineAction = GraphicHandler.OPENACTION;
    this.buildOpenButton();
    this.closeMachine();
  }

  GraphicHandler.OPENACTION = 0;
  GraphicHandler.CLOSEACTION = 1;
  GraphicHandler.OPENACTIONFUNC = [openMachineEvent, closeMachineEvent];

  GraphicHandler.prototype.changeRotor = function (side, name) {
    this.refreshFrame(side, this.controller.getRotorStart(side));
    this.rotorComponentList[side].refreshName(name);
  }

  GraphicHandler.prototype.portRemove = function (char) {
    if (this.controller.isPlugboardUsed(char)) {
      var otherChar = this.controller.getPlugboardPeer(char);
      this.controller.removePlugboardConnection(char, otherChar);
    }
  }

  GraphicHandler.prototype.portDown = function (char) {
    if (this.controller.isPlugboardUsed(char)) {
      this.plugActivation(char);
    } else {
      this.currentSelectedPlug = char;
    }
  }

  GraphicHandler.prototype.plugActivation = function (char) {
    if (this.currentActivePlug != undefined) {
      this.clickOnPlug(this.currentActivePlug);
    }
    if (char != this.currentActivePlug) {
      this.clickOnPlug(char);
      this.currentActivePlug = char;
    } else {
      this.currentActivePlug = undefined;
    }
  }

  GraphicHandler.prototype.clickOnPlug = function (char) {
    var otherChar = this.controller.getPlugboardPeer(char);
    this.plugboadComponent.clickOn(char);
    if (char != otherChar) {
      this.plugboadComponent.clickOn(otherChar);
    }
  }

  GraphicHandler.prototype.portUp = function (char) {
    if (this.currentSelectedPlug != undefined && !this.controller.isPlugboardUsed(char) && !this.controller.hasMaximumPlugboardConnection()) {
      this.controller.addPlugboardConnection(this.currentSelectedPlug, char);
      this.currentSelectedPlug = undefined;
    }
  }

  GraphicHandler.prototype.openPlugboard = function () {
    this.plugboadComponent.open();
  }

  GraphicHandler.prototype.closePlugboard = function () {
    this.plugboadComponent.close();
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
      this.rotateWheels();
    }
  }

  GraphicHandler.prototype.rotateWheels = function () {
    for (var side in this.rotorComponentList) {
      this.rotorComponentList[side].refreshWheel();
    }
  }

  GraphicHandler.prototype.keyUp = function () {
    if (this.lastCryptedChar != undefined) {
      this.outputKeyboard.disable(this.lastCryptedChar);
      this.lastCryptedChar = undefined;
    }
  }

  GraphicHandler.prototype.refreshFrame = function (side, char) {
    this.rotorComponentList[side].refreshFrame(char);
  }

  GraphicHandler.prototype.openMachine = function () {
    console.log("opening machine");
    this.setOpen(true);
    this.outputKeyboard.open();
    this.openMachineComponents();
    this.reverseOpenAction(GraphicHandler.CLOSEACTION);
  }

  GraphicHandler.prototype.closeMachine = function () {
    console.log("closing machine");
    this.setOpen(false);
    this.outputKeyboard.close();
    this.closeMachineComponents();
    this.reverseOpenAction(GraphicHandler.OPENACTION);
  }

  GraphicHandler.prototype.openMachineComponents = function () {
    $("#machine-components").removeClass("machine-components-close");
    $("#machine-components").addClass("machine-components-open");
    for (var side in this.rotorComponentList) {
      this.rotorComponentList[side].open();
    }
    this.reflectorComponent.open();
  }

  GraphicHandler.prototype.closeMachineComponents = function () {
    $("#machine-components").removeClass("machine-components-open");
    $("#machine-components").addClass("machine-components-close");
    for (var side in this.rotorComponentList) {
      this.rotorComponentList[side].close();
    }
    this.reflectorComponent.close();
  }

  GraphicHandler.prototype.buildOpenButton = function () {
    var $button = $("<button/>", {
      id: "open-button",
      class: "open-button",
      html: ""
    });
    $button.appendTo("#machine-output");
    this.changeOpenAction(this.currentMachineAction);
  }

  GraphicHandler.prototype.reverseOpenAction = function (action) {
    this.changeOpenAction(action);
  }

  GraphicHandler.prototype.changeOpenAction = function (action) {
    $("#open-button").off('click');
    $("#open-button").click({
      handler: this
    }, GraphicHandler.OPENACTIONFUNC[action]);
    this.currentMachineAction = action;
  }

  GraphicHandler.prototype.changeReflector = function (name) {
    this.reflectorComponent.changeReflector(name);
  }

  GraphicHandler.prototype.isOpen = function () {
    return this.open;
  }

  GraphicHandler.prototype.setOpen = function (open) {
    this.open = open;
  }

  GraphicHandler.prototype.addPlug = function (entry1, entry2) {
    this.plugboadComponent.addPlug(entry1, entry2);
    if (this.controller.hasMaximumPlugboardConnection()) {
      this.plugboadComponent.disable();
    }
  }

  GraphicHandler.prototype.removePlug = function (entry1, entry2) {
    this.plugboadComponent.removePlug(entry1, entry2);
    if (!this.controller.hasMaximumPlugboardConnection()) {
      this.plugboadComponent.enable();
    }
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
    this.graphicHandler.changeReflector(name);
  }

  MachineController.prototype.changeRotor = function (side, name) {
    MachineController.log("changeRotor(" + side + ", " + name + ")");
    var old = this.getRotorName(side);
    this.machine.setRotorOnSide(side, name);
    this.utilityHandler.changeRotor(side, name);
    this.graphicHandler.changeRotor(side, name);
    for (var otherSide in [Machine.LEFT_ROTOR, Machine.MIDDLE_ROTOR, Machine.RIGHT_ROTOR]) {
      if (side != otherSide && this.machine.getRotorOnSide(otherSide).getName() == name) {
        this.machine.setRotorOnSide(otherSide, old);
        this.utilityHandler.changeRotor(otherSide, old);
        this.graphicHandler.changeRotor(otherSide, old);
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

  MachineController.prototype.addPlugboardConnection = function (entry1, entry2) {
    entry1 = entry1.toUpperCase();
    entry2 = entry2.toUpperCase();
    MachineController.log("addPlugboardConnection(" + entry1 + ", " + entry2 + ")");
    this.plugItemCounter++;
    this.machine.addPlugboardConnection(entry1, entry2);
    this.utilityHandler.addPlug(entry1, entry2);
    this.graphicHandler.addPlug(entry1, entry2);
  }

  MachineController.prototype.removePlugboardConnection = function (entry1, entry2) {
    entry1 = entry1.toUpperCase();
    entry2 = entry2.toUpperCase();
    MachineController.log("removePlugboardConnection(" + entry1 + ", " + entry2 + ")");
    this.plugItemCounter--;
    this.machine.removePlugboardConnection(entry1, entry2);
    this.utilityHandler.removePlug(entry1, entry2);
    this.graphicHandler.removePlug(entry1, entry2);
  }

  MachineController.prototype.isPlugboardUsed = function (char) {
    MachineController.log("isPlugboardUsed(" + char + ")");
    return this.machine.isPlugboardUsed(char);
  }

  MachineController.prototype.getPlugboardPeer = function (char) {
    return this.machine.plug(char);
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
      this.graphicHandler.refreshFrame(side, this.getRotorStart(side));
    }
    this.utilityHandler.refreshParameters(starts, rings);
  }

  /* Main */

  function main(args) {
    var controller = new MachineController();
  }
  main();

});
