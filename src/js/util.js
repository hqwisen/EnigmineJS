
/* CONST */

var LOG_ENIGMA = false;

/* KeyCode utility */

function KeyCode(){}
  
KeyCode.A = 65;
KeyCode.Z = 90;
KeyCode.BACKSPACE = 8;
KeyCode.DELETE = 46;

KeyCode.isAlpha = function(keyCode){
  return keyCode >= KeyCode.A && keyCode <= KeyCode.Z;
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

