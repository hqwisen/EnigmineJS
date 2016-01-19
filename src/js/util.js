
/* CONST */

var LOG_ENIGMA = false;

/* KeyCode utility */

function KeyCode(){}

KeyCode.A = 65;
KeyCode.Z = 90;

KeyCode.BACKSPACE = 8;
KeyCode.DELETE = 46;

KeyCode.SPACE = 32;
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

KeyCode.isSpace = function(keyCode){
  return keyCode == KeyCode.SPACE;
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

/* Char utility */

function CharUtil(){}

CharUtil.inRegexp = function(char, regexp){
  if(char == undefined){
    return false;
  }
  char = char.charAt(0);
  if(char.match(regexp) == null){
    return false;
  }else{
    return true;
  }
}

CharUtil.isUpperCase = function(char){
  return CharUtil.inRegexp(char, /[A-Z]/);
}

CharUtil.isLowerCase = function(char){
  return CharUtil.inRegexp(char, /[a-z]/);
}

CharUtil.isChar = function(char){
  return CharUtil.inRegexp(char, /[A-Za-z]/);
}

/* Html utility */

function HtmlUtil(){}

HtmlUtil.changeSelector = function(object, currentId){
  if(currentId != object.lastId){
    $(currentId).css({background:"#004d95", color:"white"});
    $(currentId).hover(function(){$(currentId).css({background:"#004d95", color:"white"});},
                      function(){$(currentId).css({background:"#004d95", color:"white"});});

    if(object.lastId != undefined){
      $(object.lastId).css({background:"inherit", color:"#3f668b"});
      $(object.lastId).hover(function(){$(this).css({background:"#004D95", color:"white"});},
                           function(){$(this).css({background:"inherit", color:"#3f668b"});});
    }
    object.lastId = currentId;
  }
}


