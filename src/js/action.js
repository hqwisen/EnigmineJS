$(function(){
  "use strict";
  /* Instanciate an enigma machine */
  
  var enigmaMachine = new Enigma();
  
  /* Execute enigma */
  
  function inputChange(e){
    if (e.which >= 65 && e.which <= 90) {
      this.lastChar = String.fromCharCode(e.keyCode);  
      this.encryptChar = enigmaMachine.process(this.lastChar);
      $('#outputarea').html($('#outputarea').html() + this.encryptChar);
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
    "defaultindex":4,
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

  
  /* RotorHtml class */
  function RotorHtml(config){
    "use strict";
    this.config = config;  
    this.currentIndex = undefined;
    
    this.activateChoice = function(index){
       var buttonid = this.shtmlid("choice")+index.toString();
      $(buttonid).css({"background":"#505050"});   
      enigmaMachine.setRotor(this.config["rotor"], Rotor.NAME[index]);
      this.setStart(enigmaMachine.getRotor(this.config["rotor"]).getCharStart());
    }
    
    this.deactivateChoice = function(index){
      var buttonid = this.shtmlid("choice")+index.toString();
      $(buttonid).css({"background":"#9a9a9a"});   
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
      $(this.shtmlid("startvalue")).text(start);
      this.config["start"] = start;
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
      tmp = HtmlUtil.div("settingblock", this.htmlid("startblock"));
      $(this.shtmlid()).append(tmp);
      /* Adding start title*/
      tmp = HtmlUtil.div("settingname", "", "Start");
      $(this.shtmlid("startblock")).append(tmp);
      /* Adding valuecontainer */
      tmp = HtmlUtil.div("valuecontainer", this.htmlid("startcontainer"));
      $(this.shtmlid("startblock")).append(tmp);
      /* Adding value */
      tmp = HtmlUtil.div("settingvalue", this.htmlid("startvalue"));
      $(this.shtmlid("startcontainer")).append(tmp);
      /* Adding startbuttons */
      tmp = HtmlUtil.div("settingbutton", this.htmlid("startbuttons"));
      $(this.shtmlid("startcontainer")).append(tmp);
      $(this.shtmlid("startbuttons")).append(HtmlUtil.button("settingbutton", this.htmlid("startup")));
      $(this.shtmlid("startbuttons")).append(HtmlUtil.button("settingbutton", this.htmlid("startdown")));
      $(this.shtmlid("startup")).append("&#x21A5;");
      $(this.shtmlid("startdown")).append("&#x21A7;");
      /* Setting default start value */
      //this.setStart(this.config["start"]);
      // ALREADY setStart in default activateChoice
      /* Adding listener to up/down buttons */
      $(this.shtmlid("startup")).click({rhtml:this}, startUp);
      $(this.shtmlid("startdown")).click({rhtml:this}, startDown);
      /* Active a default rotor */
      this.activateChoice(this.config["defaultindex"]);
      this.currentIndex = this.config["defaultindex"];
      
    }
    
    this.shtmlid = function(value){
      return "#rotor"+config["side"]
        +(value == undefined ? "" : value);
    }
    this.htmlid = function(value){
      return "rotor"+config["side"]
        +(value == undefined ? "" : value);
    }
    
    this.logConfig = function(){
      console.log(this.config);
    }
  }
  /* Add listener to inputarea */
  $('#inputarea').keydown(inputChange);
  /* Add listener to reflector buttons */
  $('#refl_B').click(changeReflectorToB);
  $('#refl_C').click(changeReflectorToC);
  /* Setting the B reflector for the first exe */
  changeReflectorToB();
  /* Build all RotorHtml */
  for(var side in RotorHtml.ROTORS){
    RotorHtml.ROTORS[side].build();
  }
});




