$(document).ready(function() {
  $(".button").click(function() {
    gotclicked(this);
  })

  initCalculatorState();
});

var offScreenValue,
  onScreenValueInt,
  decimalPlace,
  operatorInUse,
  newValue;

var DISPLAY_MAX_DIGITS = 10;

function initCalculatorState() {
  offScreenValue = 0;
  onScreenValueInt = 0;
  decimalPlace = null;
  operatorInUse = null;
  newValue = false;

  updateDisplay();
}

var NUMERIC_KEYS = new Set("0 1 2 3 4 5 6 7 8 9".split(" ")),
  OPERATOR_KEYS = new Set("+ – × ÷".split(" "));

function gotclicked(key) {
  var keyLabel = key.innerHTML;

  if (NUMERIC_KEYS.has(keyLabel))
    clickedDigit(parseInt(keyLabel));
  else if (OPERATOR_KEYS.has(keyLabel))
    clickedOperator(keyLabel);
  else switch (keyLabel) {
    case ("AC"):
      clickedAC();
      break;
    case ("CE"):
      clickedCE();
      break;
    case ("%"):
      clickedPercent();
      break;
    case ("."):
      clickedDecimal();
      break;
    case ("="):
      clickedEquals();
      break;
    default:
      console.log("What was that??");
  }

  updateDisplay();
}

function clickedDigit(digit) {
  clearForNewValueIfNecessary();

  var displayWidth = determineDisplayWidth();

  if (displayWidth >= DISPLAY_MAX_DIGITS)
    return;

  if (decimalPlace !== null) decimalPlace++;
  onScreenValueInt = onScreenValueInt * 10 + digit;
  updateDisplay();
}

function determineDisplayWidth() {
  return Math.ceil(Math.log(Math.abs(onScreenValueInt)) / Math.LN10) +
    (onScreenValueInt < 0 ? 1 : 0);
}

function clickedDecimal() {
  clearForNewValueIfNecessary();
  if (decimalPlace === null) decimalPlace = 0;
}

function clickedEquals() {
  resolveCalculation();
  offScreenValue = getOnScreenValue();
  newValue = true;
}

function clickedOperator(operator) {
  if (!newValue)
    clickedEquals();
  operatorInUse = operator;
}

function clickedAC() {
  initCalculatorState();
}

function clickedCE() {
  onScreenValueInt = 0;
  decimalPlace = null;
}

function clickedPercent() {
  var displayValue = getOnScreenValue(),
    newDisplayValue;

  switch (operatorInUse) {
    case ("+"):
    case ("–"):
      newDisplayValue = offScreenValue * displayValue / 100;
      console.log(newDisplayValue);
      break;
    case ("×"):
    case ("÷"):
    case (null):
      newDisplayValue = displayValue / 100;
      console.log(newDisplayValue);
      break;
    default:
      console.log("How do I take the percent with this operator?");
      console.log(operatorInUse);
  }

  setOnScreenValue(newDisplayValue);
}

function clearForNewValueIfNecessary() {
  if (newValue) {
    newValue = false;
    onScreenValueInt = 0;
    decimalPlace = null;
  }
}

function updateDisplay() {
  var toDisplay = getOnScreenValue().toFixed(decimalPlace === null ? 0 : decimalPlace);

  if (decimalPlace === 0)
    toDisplay += ".";

  if (toDisplay.length > DISPLAY_MAX_DIGITS) {
    if (toDisplay.indexOf(".") <= DISPLAY_MAX_DIGITS)
      toDisplay = toDisplay.substr(0, DISPLAY_MAX_DIGITS)
    else {
      initCalculatorState();
      toDisplay = "Error";
    }
  }

  writeDisplay(toDisplay);
}

function writeDisplay(toDisplay) {
  $("#display").text(toDisplay);
}

function resolveCalculation() {
  if (operatorInUse === null)
    return;

  var first = offScreenValue,
    second = getOnScreenValue(),
    result;

  switch (operatorInUse) {
    case ("+"):
      result = first + second;
      break;
    case ("–"):
      result = first - second;
      break;
    case ("×"):
      result = first * second;
      break;
    case ("÷"):
      result = first / second;
      break;
    case (null):
      console.log("Why are you sending me null operator?");
      break;
    default:
      console.log("What kind of operator is this?")
      console.log(operatorInUse);
  }

  offScreenValue = 0;
  setOnScreenValue(result);

  operatorInUse = null;
}

function getOnScreenValue() {
  return onScreenValueInt / (decimalPlace === null ? 1 : Math.pow(10, decimalPlace));
}

function setOnScreenValue(result) {
  var onScreenResult,
    decimalLocation;

  onScreenResult = result.toString();
  decimalLocation = onScreenResult.indexOf(".");

  if (decimalLocation === -1) {
    onScreenValueInt = result;
    decimalPlace = null;
  } else {
    decimalPlace = onScreenResult.length - decimalLocation - 1;
    onScreenValueInt = Math.floor(result * Math.pow(10, decimalPlace));
  }
}