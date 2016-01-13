
/* CONST */

var LOG_ENIGMA = false;

/* KeyCode utility */

function KeyCode(){}
  
KeyCode.A = 65;
KeyCode.Z = 90;

KeyCode.BACKSPACE = 8;
KeyCode.DELETE = 46;

KeyCode.CONTROL = 17;

KeyCode.ARROWLEFT = 37;
KeyCode.ARROWUP = 38;
KeyCode.ARROWRIGHT = 39;
KeyCode.ARROWDOWN = 40;

KeyCode.isAlpha = function(keyCode){
  return keyCode >= KeyCode.A && keyCode <= KeyCode.Z;
}

KeyCode.isBackspace = function(keyCode){
  return keyCode == KeyCode.BACKSPACE;
}

KeyCode.isDelete = function(keyCode){
  return keyCode == KeyCode.DELETE; 
}

KeyCode.isControl = function(keyCode){
  return keyCode == KeyCode.CONTROL;
}

KeyCode.isArrow = function(keyCode){
  return KeyCode.isArrowUp(keyCode) || KeyCode.isArrowDown(keyCode)
    || KeyCode.isArrowLeft(keyCode) || KeyCode.isArrowRight(keyCode);
}

KeyCode.isArrowUp = function(keyCode){
  return keyCode == KeyCode.ARROWUP;
}

KeyCode.isArrowDown = function(keyCode){
  return keyCode == KeyCode.ARROWDOWN;
}

KeyCode.isArrowLeft = function(keyCode){
  return keyCode == KeyCode.ARROWLEFT;
}

KeyCode.isArrowRight = function(keyCode){
  return keyCode == KeyCode.ARROWRIGHT;
}

KeyCode.toChar = function(keyCode){
  return String.fromCharCode(keyCode);
}

/* String utility */

function StringUtil(){}
StringUtil.removeSeq = function(string, start, end){
  return string.substring(0, start) + string.substring(end, string.length);
}

StringUtil.remove = function(string, index){
  return StringUtil.removeSeq(string, index, index+1);
}

StringUtil.add = function(string, char){
  return string + char;
}

StringUtil.removeSpace = function(string){
  return string.replace(/ /g, "");
}

StringUtil.inBlock = function(string, blockSize){
  var nbBlock = Math.ceil(string.length/blockSize);
  var result = "";
  for(var i=0;i<string.length;i++){
    if(i != 0 && i % blockSize == 0){
      result+= " ";
    }
    result+=string.charAt(i);
  }
  return result;
}

/* Html utility */

function HtmlUtil(){}

HtmlUtil.htmlTag = function(tag, className, idName, content){
  return "<"+tag+" class='"
    +(className == undefined ? "" : className)+"' id='"
    +(idName == undefined ? "" : idName)+"'>"
    +(content == undefined ? "" : content)+"</"+tag+">";  
}
  
HtmlUtil.div = function(className, idName, content){
  return HtmlUtil.htmlTag("div", className, idName, content);
}
  
HtmlUtil.span = function(className, idName, content){
  return HtmlUtil.htmlTag("span", className, idName, content);
}
  
HtmlUtil.button = function(className, idName, content){
  return HtmlUtil.htmlTag("button", className, idName, content);
}
/*
var s = "HAKIM";
console.log(s);
s = StringUtil.removeSeq(s, 0, 5);
console.log(s);
*/

