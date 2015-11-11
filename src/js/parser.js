"use strict";

$(function(){
  $('#inputarea').keyup(function(){
    $('#outputarea').html(this.value);
  });
});

/*
function inputAreaChange(){
  var outputArea = document.getElementById("outputarea");
  outputArea.innerHTML = "Changing" + inputAreaChange.counter;
  inputAreaChange.counter++;
  this.value = this.value.toUpperCase();
}
inputAreaChange.counter = 0;
var inputArea = document.getElementById("inputarea");
inputArea.onkeydown = inputAreaChange;
*/
