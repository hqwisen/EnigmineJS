
$(function(){
  "use strict";
  var enigmaMachine = new Enigma();
  function inputChange(e){
    if (e.which >= 65 && e.which <= 90) {
      this.lastChar = String.fromCharCode(e.keyCode);  
      this.encryptChar = enigmaMachine.process(this.lastChar);
      $('#outputarea').html($('#outputarea').html() + this.encryptChar);
    }  
  }
  
  /*<div class="rotor">
          <div class="rotorname">
            <span class="rotorname">Rotor I</span>
          </div>
          <div class="rotorchoice">
            <button class="rotorchoice">I</button>
            <button class="rotorchoice">II</button>
            <button class="rotorchoice">III</button>
            <button class="rotorchoice">IV</button>
            <button class="rotorchoice">V</button>
          </div>
          <div class="rotorstart">
            <div class="settingname">Start</div>
            <div class="startsetting">A</div>
          </div>
          <div class="rotorring">            
            <div class="settingname">Ring</div>
            <div class="ringsetting">A-01</div>
          </div>
        </div>*/
        
  
  
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
  
  function addRotorHtml(rotor){
    var nameid = undefined;
    if(rotor == Enigma.LEFT_ROTOR){
      nameid = "left";
    }else if(rotor == Enigma.MIDDLE_ROTOR){
      nameid = "middle";
    }else if(rotor == Enigma.RIGHT_ROTOR){
      nameid = "right";  
    }
    var rotorid = function(str){return "rotor"+nameid+(str == undefined ? "" : str);};
    /* Adding div rotor */
    $(".parameters").append(divString("rotor", rotorid()));
    /* Adding the rotorname */
    $("#"+rotorid()).append(divString("rotorname", "",
                                      spanString("rotorname", rotorid("name"))));
    $("#"+rotorid("name")).append(rotorid());
    /* Adding rotorchoice buttons */
    $("#"+rotorid()).append(divString("rotorchoice", rotorid("choice")));
    $("#"+rotorid("choice")).append
    
    
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