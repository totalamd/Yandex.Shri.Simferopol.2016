/** 
  * @param {Array} data – массив CSS классов
  * @return {Object.<string, string>} - объект с полями {старое имя класса: минимизированное имя класса}
  * @field {string} - старое имя класса
  * @field {string} - минифицированное имя класса
  * Test are in readme.md
  */
module.exports = function (data) {
  // Ваш код

  'use strict';

  const list_of_class_names = {};
  const result = {};
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_0123456789';
  const BASE = ALPHABET.length;

  /**
   * iterator returns new minified class name
   * which is a number in base 64 number system
   * @return {String}
   */
  const iterator = (function* () {
    // accumulator is array containing digits of current base-64 number
    // most significant digit at last place
    // @type Number[]
    let accumulator = [0];
    let minified_name;

    while (true) {
      // doing reduceRight() to get inversed digit positioning:
      // most significant digit at the first place (i.e. at the left side)
      minified_name = accumulator.reduceRight((prev_val, curr_val) => {
        return prev_val + ALPHABET[curr_val];
      }, '');

      accumulator[0]++;

      accumulator.forEach((value, index) => {
        if (
          // check if current digit overflow
          (value >= BASE) ||
          // special check: BASE for first digit reduced by 10
          // to avoid numbers at the first position in minified name
          (index === accumulator.length - 1 && value >= BASE - 10)
        ) {
          accumulator[index] = 0;
          ++accumulator[index + 1] || (accumulator[index + 1] = 0);
        }
      });

      yield minified_name;
    }
  })()


  if (!Array.isArray(data)) {
    throw new TypeError('Incoming data is not array');
  }

  /**
   * list_of_class_names
   * @type {Object.<string, number>}
   * @field {String} - origin CSS class name
   * @field {Number} - number of times CSS class name occurs in incoming data
   * */
  data.forEach(function (element, index) {
    if (typeof element !== 'string') { throw new TypeError(`Element at index ${index} is not string`) }
    if (element.length <= 0) { throw new RangeError(`Element at index ${index} has zero length`) }
    if (!list_of_class_names[element]) {
      list_of_class_names[element] = 1;
    } else {
      list_of_class_names[element]++;
    }
  });

  /**
    * sorted_by_freq_array
    * @type {Array.<Array.<string, number>>} - Array of Array<string, number>
    * @field {String} - origin CSS class name
    * @field {Number} - number of times CSS class name occurs in incoming data
    * */
  const sorted_by_freq_array = [];
  for (var key in list_of_class_names) {
    sorted_by_freq_array.push([key, list_of_class_names[key]]);
  }

  sorted_by_freq_array.sort((a, b) => {
    return b[1] - a[1];
  });

  sorted_by_freq_array.forEach((element, index) => {
    result[element[0]] = iterator.next().value;
  });

  return result;
};
