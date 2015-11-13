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
    "defaultindex":0
  }
  var middleConfig = {
    "rotor":Enigma.MIDDLE_ROTOR,
    "side":"middle",
    "defaultindex":1
  }
  var rightConfig = {
    "rotor":Enigma.RIGHT_ROTOR,
    "side":"right",
    "defaultindex":2
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
  /* RotorHtml class */
  function RotorHtml(config){
    "use strict";
    this.config = config;  
    this.currentIndex = undefined;
    
    this.activateChoice = function(index){
       var buttonid = this.shtmlid("choice")+index.toString();
      $(buttonid).css({"background":"#505050"});   
      enigmaMachine.setRotor(this.config["rotor"], Rotor.NAME[index]);
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
        $(this.shtmlid("choice"+i.toString())).click({rhtml:this, "index":i}, choiceAction);
      }
      /* Active a default rotor for the side */
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



    /*$(".parameters").append("<div class='rotor'><div class='rotorname'><span class='rotorname'>"+name+" Rotor</span></div><div class='rotorchoice'><button class='rotorchoice'>I</button><button class='rotorchoice'>II</button><button class='rotorchoice'>III</button><button class='rotorchoice'>IV</button><button class='rotorchoice'>V</button></div><div class='rotorstart'><div class='settingname'>Start</div><div class='startsetting'><div class='startvalue'>A</div><div class='startbutton'><button class='startbutton'>&#x21A5;</button><button class='startbutton'>&#x21A7;</button></div></div></div><div class='rotorstart'><div class='settingname'>Ring</div><div class='startsetting'><div class='startvalue'>A-01</div><div class='startbutton'><button class='startbutton'>&#x21A5;</button><button class='startbutton'>&#x21A7;</button></div></div></div></div>");*/
  }
