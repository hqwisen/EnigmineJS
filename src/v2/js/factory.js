

var data = {
  "I": {
    "wires": "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "notch": "Q"
  },
  "II": {
    "wires": "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "notch": "E"
  },
  "III": {
    "wires": "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    "notch": "V"
  },
  "IV": {
    "wires": "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    "notch": "J"
  },
  "V": {
    "wires": "VZBRGITYUPSDNHLXAWMJQOFECK",
    "notch": "Z"
  }
}

function RotorFactory() {}

RotorFactory.createRotor = function(name){
  return new Rotor(name, data[name]["wires"], data[name]["notch"]);
}

RotorFactory.createRomanOne = function(){
  return RotorFactory.createRotor("I");
}

RotorFactory.createRomanTwo = function(){
  return RotorFactory.createRotor("II");
}

RotorFactory.createRomanThree = function(){
  return RotorFactory.createRotor("III");
}

RotorFactory.createRomanFour = function(){
  return RotorFactory.createRotor("IV");
}

RotorFactory.createRomanFive = function(){
  return RotorFactory.createRotor("V");
}