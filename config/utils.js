/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
export function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Create a random color value.
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @return {String} A random six-digit color hexcode
 */
export function createColor() {
  // The available hex options
  var hex = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
  ];

  /**
   * Create a six-digit hex color
   */
  var hexColor = function() {
    var color = "#";

    for (var i = 0; i < 6; i++) {
      // Shuffle the hex values
      shuffle(hex);

      // Append first hex value to the string
      color += hex[0];
    }

    return color;
  };

  // Return the color string
  return hexColor();
}

/**
 * Create an immutable clone of an array or object
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Array|Object} obj The array or object to copy
 * @return {Array|Object}     The clone of the array or object
 */
export function copy(obj) {
  //
  // Methods
  //

  /**
   * Create an immutable copy of an object
   * @return {Object}
   */
  var cloneObj = function() {
    // Create new object
    var clone = {};

    // Loop through each item in the original
    // Recursively copy it's value and add to the clone
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = copy(obj[key]);
      }
    }

    return clone;
  };

  /**
   * Create an immutable copy of an array
   * @return {Array}
   */
  var cloneArr = function() {
    return obj.map(function(item) {
      return copy(item);
    });
  };

  //
  // Inits
  //

  // Get object type
  var type = Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();

  // If an object
  if (type === "object") {
    return cloneObj();
  }

  // If an array
  if (type === "array") {
    return cloneArr();
  }

  // Otherwise, return it as-is
  return obj;
}
