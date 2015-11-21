$(function(){
  "use strict";
  
  // TODO afficher position de depart
  // TODO input back up
  // TODO plugboard
  // TODO selection + keydown (pas delete ou backspace
  // TODO Keydown au mileu du texte
  // TODO delete of non-alpha char 
  // TODO quand ecrit texte au milieu
  // TODO static method outside class
  // TODO Fix behaviour plugboard (int and out !!!)
  
  /* Instanciate an enigma machine */
  
  var enigmaMachine = new Enigma();
  
  /* InputHandler (Execute enigma) */
  
  InputHandler.inputKeyDown = function(event){
    var handler = event.data.handler;
    if(!handler.isControlPressed()){
      if (KeyCode.isAlpha(event.keyCode)) {
        handler.refreshOutput(KeyCode.toChar(event.keyCode), false, false);
      }else if(KeyCode.isBackspace(event.keyCode)){
        handler.refreshOutput(undefined, true, false);
      }else if(KeyCode.isDelete(event.keyCode)){
        handler.refreshOutput(undefined, false, true);
      }else if(KeyCode.isControl(event.keyCode)){
        handler.setControlPressed(true);
      }else if(!KeyCode.isArrow(event.keyCode)){
        event.preventDefault();
      }
    }else{
    }
  }
  
  InputHandler.inputKeyUp = function(event){
    var handler = event.data.handler;
    handler.refreshInput(); 
    if(KeyCode.isControl(event.keyCode)){
      handler.setControlPressed(false);
    }
  }
  
  InputHandler.BLOCKSIZE = 0;
  
  function InputHandler(inputid, outputid){
  
    this.inputid = inputid;
    this.outputid = outputid;
    this.controlPressed = false;

    this.listen = function(){
      $(this.shtml(inputid)).keydown({handler:this}, InputHandler.inputKeyDown);
      $(this.shtml(inputid)).keyup({handler:this}, InputHandler.inputKeyUp);
    }
    
    this.isControlPressed = function(){
      return this.controlPressed;
    }
    
    this.setControlPressed = function(value){
      this.controlPressed = value;
    }
    
    this.disableStartButtons = function(){
      for(var rname in RotorHtml.ROTORS){
        RotorHtml.ROTORS[rname].disableStartButtons();
      }
    }
    
    this.enableStartButtons = function(){
      for(var rname in RotorHtml.ROTORS){
        RotorHtml.ROTORS[rname].enableStartButtons();
      }
    }
    
    this.refreshInput = function(){
      //this.setInputVal(this.getInputVal());
    }
    
    this.refreshOutput = function(newChar, isBackspace, isDelete){
      var start = this.getStart(), end = this.getEnd();
      var refreshOutput = this.getOutputVal();
      var nbrDel = refreshOutput.length - start;
      if(start == end){
        if(start != refreshOutput.length){
          refreshOutput = StringUtil.removeSeq(refreshOutput, start, refreshOutput.length);  
          if(isBackspace){
            refreshOutput = StringUtil.remove(refreshOutput, start-1);
          }
          enigmaMachine.reverseProcess(nbrDel+(isBackspace && start!=0?1:0));
          if(newChar != undefined){
            refreshOutput = StringUtil.add(refreshOutput, enigmaMachine.process(newChar));    
          }
          for(var i=(isDelete?1:0);i<nbrDel;i++){
            refreshOutput = StringUtil.add(refreshOutput,
                                           enigmaMachine.process((this.inputCharAt(start+i))));   
          }
        }else{
          if(newChar != undefined){
            refreshOutput = StringUtil.add(refreshOutput, enigmaMachine.process(newChar));    
          }else if(isBackspace && start != 0){
            refreshOutput = StringUtil.remove(refreshOutput, refreshOutput.length-1); 
            enigmaMachine.reverseProcess(1);
          }
        }
      }else{
        refreshOutput = StringUtil.removeSeq(refreshOutput, start, refreshOutput.length); 
        enigmaMachine.reverseProcess(nbrDel);
        if(newChar != undefined){
          refreshOutput = StringUtil.add(refreshOutput, enigmaMachine.process(newChar));    
        }
        for(var i=0;i<nbrDel - (end - start);i++){
          refreshOutput = StringUtil.add(refreshOutput,
                                         enigmaMachine.process((this.inputCharAt(end+i))));   
        }
      }
      this.setOutputVal(refreshOutput);
      if(refreshOutput.length == 0){
        this.enableStartButtons();
      }else{
        this.disableStartButtons();
      }
    }
    
    this.shtml = function(id){
      return "#"+id;
    }
    
    this.sinputid = function(){
      return this.shtml(this.inputid);
    }
    this.soutputid = function(){
      return this.shtml(this.outputid);
    }
    
    this.getVal = function(id){
      return StringUtil.removeSpace($(this.shtml(id)).val());
    }
    
    this.setVal = function(id, value){
      $(this.shtml(id)).val(StringUtil.inBlock(value, InputHandler.BLOCKSIZE));
    }
    
    this.getOutputVal = function(){
      return this.getVal(outputid);  
    }
    
    this.getInputVal = function(){
      return this.getVal(inputid);
    }
    
    this.inputCharAt = function(index){
      return this.getInputVal().charAt(index);
    }
    
    this.outputCharAt = function(index){
      return this.getOutputVal().charAt(index);
    }
    
    this.setOutputVal = function(value){
      this.setVal(outputid, value);
    }
    
    this.setInputVal = function(value){
      this.setVal(inputid, value);
    }
    
    this.getStart = function(){
      return $(this.sinputid())[0].selectionStart;
    }
    
    this.getEnd = function(){
      return $(this.sinputid())[0].selectionEnd;  
    }
    
  }
  
  /* Reflector choice */
  
  function changeReflectorToC(e){
    $('#refl_C').css({"background":"#505050",
                     "color":"white"});
    $('#refl_B').css({"background":"#9a9a9a",
                     "color":"black"});
    enigmaMachine.setReflector("C");
  }
  
  function changeReflectorToB(e){
    $('#refl_B').css({"background":"#505050",
                     "color":"white"});
    $('#refl_C').css({"background":"#9a9a9a",
                     "color":"black"});
    enigmaMachine.setReflector("B");
  }
  
  /* Impl. of a rotor in the DOM */
  
  /* RotorHtml configs */
  
  var leftConfig = {
    "rotor":Enigma.LEFT_ROTOR,
    "side":"left",
    "defaultindex":0,
    "start":undefined,
    "ring":undefined   
  }
  var middleConfig = {
    "rotor":Enigma.MIDDLE_ROTOR,
    "side":"middle",
    "defaultindex":1,
    "start":undefined,
    "ring":undefined
  }
  var rightConfig = {
    "rotor":Enigma.RIGHT_ROTOR,
    "side":"right",
    "defaultindex":2,
    "start":undefined,
    "ring":undefined
  }
  
  /* Create RotorHtml lists */
  RotorHtml.ROTORS = {"left":new RotorHtml(leftConfig),
                     "middle":new RotorHtml(middleConfig),
                     "right":new RotorHtml(rightConfig)};
  
  /* RotorHtml listener */
  function choiceAction(event){
    var rhtml = event.data.rhtml;
    var clickedIndex = event.data.index;
    rhtml.changeChoice(clickedIndex, true);
  }
  
  function startUp(event){
    var rhtml = event.data.rhtml;
    var value = rhtml.config["start"];
    var charCode = value.charCodeAt(0);
    if(charCode >= Rotor.CHARCODEMAXSET){
      charCode = Rotor.CHARCODEMINSET;
    }else{
      charCode += 1;
    }
    rhtml.setStart(String.fromCharCode(charCode));
  }

  function startDown(event){
    var rhtml = event.data.rhtml;
    var value = rhtml.config["start"];
    var charCode = value.charCodeAt(0);
    if(charCode <= Rotor.CHARCODEMINSET){
      charCode = Rotor.CHARCODEMAXSET;
    }else{
      charCode -= 1;
    }
    rhtml.setStart(String.fromCharCode(charCode));
  }

    function ringUp(event){
    var rhtml = event.data.rhtml;
    var value = rhtml.config["ring"];
    var charCode = value.charCodeAt(0);
    if(charCode >= Rotor.CHARCODEMAXSET){
      charCode = Rotor.CHARCODEMINSET;
    }else{
      charCode += 1;
    }
    rhtml.setRing(String.fromCharCode(charCode));
  }

  function ringDown(event){
    var rhtml = event.data.rhtml;
    var value = rhtml.config["ring"];
    var charCode = value.charCodeAt(0);
    if(charCode <= Rotor.CHARCODEMINSET){
      charCode = Rotor.CHARCODEMAXSET;
    }else{
      charCode -= 1;
    }
    rhtml.setRing(String.fromCharCode(charCode));
  }

  
  /* RotorHtml class */
  function RotorHtml(config){
    "use strict";
    this.config = config;  
    this.currentIndex = undefined;
    
    this.activateChoice = function(index){
       var buttonid = this.shtmlid("choice")+index.toString();
      $(buttonid).css({"background":"#505050", color:"#FFFFFF"});   
      enigmaMachine.setRotor(this.config["rotor"], Rotor.NAME[index]);
      enigmaMachine.setRotorHtml(this.config["rotor"], this);
      this.setStart(enigmaMachine.getRotor(this.config["rotor"]).getCharStart());
      this.setRing(enigmaMachine.getRotor(this.config["rotor"]).getCharRing());
    }
    
    this.deactivateChoice = function(index){
      var buttonid = this.shtmlid("choice")+index.toString();
      $(buttonid).css({"background":"#9a9a9a", color:"#000000"});   
    }
    
    this.changeChoice = function(newIndex, checkOthers){
      if(this.currentIndex != newIndex){
        this.activateChoice(newIndex);
        this.deactivateChoice(this.currentIndex);
        if(checkOthers){
          for(var side in RotorHtml.ROTORS){
            if(RotorHtml.ROTORS[side] != this
               && newIndex == RotorHtml.ROTORS[side].currentIndex){
              RotorHtml.ROTORS[side].changeChoice(this.currentIndex, false);
            }
          }
        }
        this.currentIndex = newIndex;
      }
    }
    
    this.setStart = function(start){
      enigmaMachine.setStartRotor(this.config["rotor"], start);
      this.setStartText(start);
      this.config["start"] = start;
    }
    
    this.setStartText = function(start){
      $(this.shtmlid("startvalue")).text(Rotor.fullInfo(start));
    }
    
    this.setRing = function(ring){
      enigmaMachine.setRingRotor(this.config["rotor"], ring);
      this.setRingText(ring);
      this.config["ring"] = ring;
    }
    
    this.setRingText = function(ring){
      $(this.shtmlid("ringvalue")).text(Rotor.fullInfo(ring));
    }
    
    
    this.build = function(){
      var tmp;
      /* Add div rotor */
      tmp = HtmlUtil.div("rotor", this.htmlid());
      $(".parameters").append(tmp);
      /* Add title (rotorname) */
      tmp = HtmlUtil.span("rotorname", this.htmlid("name"), this.htmlid());
      $(this.shtmlid()).append(HtmlUtil.div("rotorname", "" , tmp));
      /* Adding rotorchoice buttons */
      $(this.shtmlid()).append(HtmlUtil.div("rotorchoice", this.htmlid("choice")));
      for(var i=0;i<Rotor.NAME.length;i++){
        tmp = HtmlUtil.button("rotorchoice", this.htmlid("choice"+i.toString()), Rotor.NAME[i]);
        $(this.shtmlid("choice")).append(tmp);
        /* Adding listener to choice buttons */
        $(this.shtmlid("choice"+i.toString())).click({rhtml:this, "index":i}, choiceAction);
      }
      /* Adding startblock */
      this.buildBlock("start");
      /* Adding ringblock */
      this.buildBlock("ring");
      /* Adding listener to up/down buttons */
      $(this.shtmlid("startup")).click({rhtml:this}, startUp);
      $(this.shtmlid("startdown")).click({rhtml:this}, startDown);
      $(this.shtmlid("ringup")).click({rhtml:this}, ringUp);
      $(this.shtmlid("ringdown")).click({rhtml:this}, ringDown);
      /* Active a default rotor */
      this.activateChoice(this.config["defaultindex"]);
      this.currentIndex = this.config["defaultindex"];
    }
    
    this.buildBlock = function(name){
      var tmp;
      /* Adding block */
      tmp = HtmlUtil.div("settingblock", this.htmlid(name+"block"));
      $(this.shtmlid()).append(tmp);
      /* Adding title name */
      tmp = HtmlUtil.div("settingname", "", name);
      $(this.shtmlid(name+"block")).append(tmp);
      /* Adding valuecontainer */
      tmp = HtmlUtil.div("valuecontainer", this.htmlid(name+"container"));
      $(this.shtmlid(name+"block")).append(tmp);
      /* Adding value */
      tmp = HtmlUtil.div("settingvalue", this.htmlid(name+"value"));
      $(this.shtmlid(name+"container")).append(tmp);
      /* Adding up/down buttons */
      tmp = HtmlUtil.div("settingbutton", this.htmlid(name+"buttons"));
      $(this.shtmlid(name+"container")).append(tmp);
      $(this.shtmlid(name+"buttons")).append(HtmlUtil.button("settingbutton", this.htmlid(name+"up")));
      $(this.shtmlid(name+"buttons")).append(HtmlUtil.button("settingbutton", this.htmlid(name+"down")));
      $(this.shtmlid(name+"up")).append("&#9650;");
      $(this.shtmlid(name+"down")).append("&#9660;");
      /* Setting default start value */
      //this.setStart(this.config["start"]);
      // ALREADY setStart in default activateChoice
    }
    
    this.shtmlid = function(value){
      return "#rotor"+config["side"]
        +(value == undefined ? "" : value);
    }
    this.htmlid = function(value){
      return "rotor"+config["side"]
        +(value == undefined ? "" : value);
    }
    
    this.refresh = function(){
      var start = enigmaMachine.getRotor(this.config["rotor"]).getCharStart();
      this.setStartText(start);
      this.config["start"] = start;
    }
    
    this.disableStartButtons = function(){
      $(this.shtmlid("startup")).prop("disabled", true);
      $(this.shtmlid("startup")).text("-");
      $(this.shtmlid("startdown")).prop("disabled", true);
      $(this.shtmlid("startdown")).text("-");  
    }

    this.enableStartButtons = function(){
      $(this.shtmlid("startup")).prop("disabled", false);
      $(this.shtmlid("startup")).html("&#9650;");
      $(this.shtmlid("startdown")).prop("disabled", false);
      $(this.shtmlid("startdown")).html("&#9660;");  
    }

    
    this.logConfig = function(){
      console.log(this.config);
    }
  }
  /* Plugboard listener  */
  
  function plugChoiceUp(event){
    var phtml = event.data.phtml;
    var choice = event.data.choice;
    phtml.plugChoiceUp(choice);
  }
  
  function plugChoiceDown(event){
    var phtml = event.data.phtml;
    var choice = event.data.choice;
    phtml.plugChoiceDown(choice);
  }
  
  function addPlugChoice(event){
    var phtml = event.data.phtml;
    var values = phtml.getPlugChoiceValues();
    phtml.addPlug(values[0], values[1]);
  }
  
  function delPlugChoice(event){
    var phtml = event.data.phtml;
    var delchoice = event.data.delchoice;
    phtml.delPlug(delchoice);
  }
  
  /* PlugboardHtml class */
  
  function PlugboardHtml(){

    this.plugList = [];
    this.ROWS = 2;
    this.COLS = 5;
    
    this.build = function(){
      var tmp;
      /* Add div plugblock */
      tmp = HtmlUtil.div("plugblock", this.htmlid("block"));
      $(".plugboard").append(tmp);
      /* Add plugcontainer */
      tmp = HtmlUtil.div("plugcontainer", this.htmlid("container"));
      $(this.shtmlid("block")).append(tmp);
      for(var i=0;i<2;i++){
        /* add plugchoicecontainer */
        tmp = HtmlUtil.div("plugchoicecontainer", this.htmlid("choicecontainer"+i));
        $(this.shtmlid("container")).append(tmp);
        /* add plugchoicevalue */
        tmp = HtmlUtil.div("plugchoicevalue", this.htmlid("choicevalue"+i));
        $(this.shtmlid("choicecontainer"+i)).append(tmp);
        $(this.shtmlid("choicevalue"+i)).append(i % 2 == 0 ? "A" : "B");
        /* add plugchoicebutton */
        tmp = HtmlUtil.div("plugchoicebutton", this.htmlid("choicebutton"+i));
        $(this.shtmlid("choicecontainer"+i)).append(tmp);
        tmp = HtmlUtil.button("plugchoicebutton", this.htmlid("choicebuttonup"+i));
        $(this.shtmlid("choicebutton"+i)).append(tmp);
        $(this.shtmlid("choicebuttonup"+i)).append(" &#9650;");    
        $(this.shtmlid("choicebuttonup"+i)).click({phtml:this, choice:i}, plugChoiceUp);
        tmp = HtmlUtil.button("plugchoicebutton", this.htmlid("choicebuttondown"+i));
        $(this.shtmlid("choicebutton"+i)).append(tmp);
        $(this.shtmlid("choicebuttondown"+i)).append(" &#9660;");                  
                $(this.shtmlid("choicebuttondown"+i)).click({phtml:this, choice:i}, plugChoiceDown);
      }
      /* Add + button */
      tmp = HtmlUtil.div("plugaddbutton", this.htmlid("addbutton"));
      $(this.shtmlid("block")).append(tmp);
      tmp = HtmlUtil.button("plugaddbutton", this.htmlid("plusbutton"));
      $(this.shtmlid("addbutton")).append(tmp);
      $(this.shtmlid("plusbutton")).append("+");
      $(this.shtmlid("plusbutton")).click({phtml:this}, addPlugChoice);   
      /* Add plugvalueblock */
      tmp = HtmlUtil.div("plugvalueblock", this.htmlid("valueblock"));
      $(".plugboard").append(tmp);
      /* Add plugvaluerows */
      for(var row=0;row<this.ROWS;row++){
        tmp = HtmlUtil.div("plugvaluerow", this.htmlid("valuerow"+row));
        $(this.shtmlid("valueblock")).append(tmp);
      }  
    }
    
    
    this.refreshPlugboard = function(refreshChoice){
      var tmp;
      var counter = 1;
      var breakAddPlug = false;
      for(var row=0;row<this.ROWS;row++){
        $(this.shtmlid("valuerow"+row)).text("");
        for(var col=0;col<this.COLS;col++){
          if(counter  <= this.plugList.length){
            tmp = HtmlUtil.div("plugvalue", this.htmlid("valuerow"+row+col));
            $(this.shtmlid("valuerow"+row)).append(tmp);
            tmp = enigmaMachine.plugToStr(this.plugList[counter-1][0], this.plugList[counter-1][1]);
            $(this.shtmlid("valuerow"+row+col)).append(tmp);
            tmp = HtmlUtil.button("plugvaluedelete", this.htmlid("delete"+row+col));
            $(this.shtmlid("valuerow"+row+col)).append(tmp);
            $(this.shtmlid("delete"+row+col)).append("&#10060;");
            $(this.shtmlid("delete"+row+col)).click({phtml:this, delchoice:(counter-1)}, delPlugChoice);         
          }else{
            breakAddPlug = true;
          }
          if(breakAddPlug){
            break;
          }else{
            counter++;    
          }
        }
        if(breakAddPlug){
            break;
        }
      }
      counter--;
      if(refreshChoice){
        this.plugChoiceUp(0);
        this.plugChoiceUp(1);        
      }
      if(counter == enigmaMachine.MAXCABLE){
        $(this.shtmlid("plusbutton")).prop("disabled", true);
        $(this.shtmlid("plusbutton")).css({background:"#9a9a9a"});
        $(this.shtmlid("plusbutton")).text(""); 
      }else{
        $(this.shtmlid("plusbutton")).prop("disabled", false);
        $(this.shtmlid("plusbutton")).css({background:"#505050"});
        $(this.shtmlid("plusbutton")).text("+"); 
      }
    }
    
    this.getPlugChoiceValues = function(){
      return [$(this.shtmlid("choicevalue0")).text(),
             $(this.shtmlid("choicevalue1")).text()];
    }
    
    this.plugChoiceUp = function(choice){
      var char = $(this.shtmlid("choicevalue"+choice)).text();
      var otherChoice = choice % 2 == 0 ? 1 : 0;
      var otherChar = $(this.shtmlid("choicevalue"+otherChoice)).text();
      var charCode = char.charCodeAt(0);
      var foundNext = false;
      while(!foundNext){
        if(charCode >= Rotor.CHARCODEMAXSET){
          charCode = Rotor.CHARCODEMINSET;
        }else{
          charCode += 1;
        }
        char = String.fromCharCode(charCode);
        foundNext = !enigmaMachine.isPlugboardUsed(char) && !(char == otherChar);
      }
      $(this.shtmlid("choicevalue"+choice)).text(char);
    }
    
    this.plugChoiceDown = function(choice){
      var char = $(this.shtmlid("choicevalue"+choice)).text();
      var otherChoice = choice % 2 == 0 ? 1 : 0;
      var otherChar = $(this.shtmlid("choicevalue"+otherChoice)).text();
      var charCode = char.charCodeAt(0);
      var foundNext = false;
      while(!foundNext){
        if(charCode <= Rotor.CHARCODEMINSET){
          charCode = Rotor.CHARCODEMAXSET;
        }else{
          charCode -= 1;
        }
        char = String.fromCharCode(charCode);
        foundNext = !enigmaMachine.isPlugboardUsed(char) && !(char == otherChar);
      }
      $(this.shtmlid("choicevalue"+choice)).text(char);
    }
    
    this.addPlug = function(charIn, charOut){
      enigmaMachine.addToPlugboard(charIn, charOut);
      this.plugList.push([charIn, charOut]);
      this.refreshPlugboard(true);
;   }
    
    this.delPlug = function(delchoice){
      var charIn = this.plugList[delchoice][0];
      var charOut = this.plugList[delchoice][1];
      enigmaMachine.deleteToPlugboard(charIn, charOut);
      this.plugList.splice(delchoice, 1);
      this.refreshPlugboard(false);
    }
    
    this.shtmlid = function(value){
      return "#plugboard"+(value == undefined ? "" : value);
    }
    this.htmlid = function(value){
      return "plugboard"+(value == undefined ? "" : value);
    } 
  }
  
  /* Add listener to inputarea */
  var inputHandler = new InputHandler("inputarea", "outputarea");
  inputHandler.listen();
  /* Add listener to reflector buttons */
  $('#refl_B').click(changeReflectorToB);
  $('#refl_C').click(changeReflectorToC);
  /* Setting the B reflector for the first exe */
  changeReflectorToB();
  /* Build all RotorHtml */
  for(var side in RotorHtml.ROTORS){
    RotorHtml.ROTORS[side].build();
  }
  /* Build PlugboardHtml */
  var phtml = new PlugboardHtml();
  phtml.build();
});
