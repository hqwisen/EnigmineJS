
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
