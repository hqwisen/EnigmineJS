
/* CONST */

function KeyCode(){}
  
KeyCode.A = 65;
KeyCode.Z = 90;
KeyCode.BACKSPACE = 8;
KeyCode.DELETE = 46;
  

/* String utility */

function StringUtil(){}
StringUtil.removeSeq = function(string, start, end){
  return string.substring(0, start) + string.substring(end, string.length);
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
