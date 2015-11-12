
  
$(function(){
  "use strict";
  var enigmaMachine = new Enigma();
  var rotorNumberArray = ["I", "II", "III", "IV", "V"];
  var nameid = {};
  nameid[Enigma.LEFT_ROTOR] = "left";
  nameid[Enigma.MIDDLE_ROTOR] = "middle";
  nameid[Enigma.RIGHT_ROTOR] = "right";
  
  
  function changeActiveChoice(side, rotorIndex){
    $("#rotor"+nameid[side.rotorPlace]+"choice"+rotorIndex.toString()).css({"background":"#505050"}); 
    $("#rotor"+
      nameid[side.rotorPlace]+
      "choice"+
      side.previousRotorIndex.toString()).css({"background":"#9a9a9a"});
    side.previousRotorIndex = rotorIndex;
    enigmaMachine.setRotor(side.rotorPlace,
                           rotorNumberArray[rotorIndex]);
  }
  
  function choiceAction(side, event){
    if(event == undefined){
      side.previousRotorIndex = side.first;
      $("#rotor"+nameid[side.rotorPlace]+
        "choice"+
        side.first.toString()).css({"background":"#505050"});
    }else{
      if(side.previousRotorIndex != event.data.rotorIndex){
        changeActiveChoice(side, event.data.rotorIndex);    
      }
    } 
  }
  
  function choiceActionLeft(){
    choiceActionLeft.rotorPlace = Enigma.LEFT_ROTOR;
    choiceActionLeft.previousRotorIndex = undefined;
    choiceActionLeft.first = 0;
    choiceActionLeft.process = function(event){
      choiceAction(choiceActionLeft, event); 
    }
  }
  function choiceActionMiddle(){
    choiceActionMiddle.rotorPlace = Enigma.MIDDLE_ROTOR;
    choiceActionMiddle.previousRotorIndex = undefined;
    choiceActionMiddle.first = 1;
    choiceActionMiddle.process = function(event){
      choiceAction(choiceActionMiddle, event); 
    }
  }
  function choiceActionRight(){
    choiceActionRight.rotorPlace = Enigma.RIGHT_ROTOR;
    choiceActionRight.previousRotorIndex = undefined;
    choiceActionRight.first = 2;
    choiceActionRight.process = function(event){
      choiceAction(choiceActionRight, event); 
    }
  }

  choiceActionLeft(); // init values
  choiceActionMiddle(); // init values
  choiceActionRight(); // init values
  var action = {};
  action[Enigma.LEFT_ROTOR] = choiceActionLeft.process;
  action[Enigma.MIDDLE_ROTOR] = choiceActionMiddle.process;
  action[Enigma.RIGHT_ROTOR] = choiceActionRight.process;

  
  function inputChange(e){
    if (e.which >= 65 && e.which <= 90) {
      this.lastChar = String.fromCharCode(e.keyCode);  
      this.encryptChar = enigmaMachine.process(this.lastChar);
      $('#outputarea').html($('#outputarea').html() + this.encryptChar);
    }  
  }
  
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
  
  function htmlTagString(tag, className, idName, content){
    return "<"+tag+" class='"
      +(className == undefined ? "" : className)+"' id='"
      +(idName == undefined ? "" : idName)+"'>"
      +(content == undefined ? "" : content)+"</"+tag+">";  
  }
  
  function divString(className, idName, content){
    return htmlTagString("div", className, idName, content);
  }
  
  function spanString(className, idName, content){
      return htmlTagString("span", className, idName, content);
  }
  
  function buttonString(className, idName, content){
      return htmlTagString("button", className, idName, content);
  }
  
  function addRotorHtml(rotor){
    var rotorid = function(str){return "rotor"+nameid[rotor]+(str == undefined ? "" : str);};
    /* Adding div rotor */
    $(".parameters").append(divString("rotor", rotorid()));
    /* Adding the rotorname */
    $("#"+rotorid()).append(divString("rotorname", "",
                                      spanString("rotorname", rotorid("name"))));
    $("#"+rotorid("name")).append(rotorid());
    /* Adding rotorchoice buttons */
    $("#"+rotorid()).append(divString("rotorchoice", rotorid("choice")));
    for(var i=0;i<rotorNumberArray.length;i++){
      $("#"+rotorid("choice")).append(buttonString("rotorchoice",
                                                   rotorid("choice"+i.toString()),
                                                   rotorNumberArray[i]));
      $("#"+rotorid("choice"+i.toString())).click({rotorIndex:i},
                                                  action[rotor]);
    }
    action[rotor](undefined);
    
    
    
    
    
    /*$(".parameters").append("<div class='rotor'><div class='rotorname'><span class='rotorname'>"+name+" Rotor</span></div><div class='rotorchoice'><button class='rotorchoice'>I</button><button class='rotorchoice'>II</button><button class='rotorchoice'>III</button><button class='rotorchoice'>IV</button><button class='rotorchoice'>V</button></div><div class='rotorstart'><div class='settingname'>Start</div><div class='startsetting'><div class='startvalue'>A</div><div class='startbutton'><button class='startbutton'>&#x21A5;</button><button class='startbutton'>&#x21A7;</button></div></div></div><div class='rotorstart'><div class='settingname'>Ring</div><div class='startsetting'><div class='startvalue'>A-01</div><div class='startbutton'><button class='startbutton'>&#x21A5;</button><button class='startbutton'>&#x21A7;</button></div></div></div></div>");*/
  }
  
  $('#inputarea').keydown(inputChange);
  $('#refl_B').click(changeReflectorToB);
  $('#refl_C').click(changeReflectorToC);
  changeReflectorToB();
  addRotorHtml(Enigma.LEFT_ROTOR);
  addRotorHtml(Enigma.MIDDLE_ROTOR);
  addRotorHtml(Enigma.RIGHT_ROTOR);
});
/*var inputs = "HAKIM";
var enigma = new Enigma();
var output = "";
for(var i=0;i<inputs.length;i++){
  output+=enigma.process(inputs[i]);
}
console.log(output);*/