(function(exports) {
  /* globals  window */
  'use strict';

  /**
   * Choose an element (word) out of an array (of words)
   *
   * @param  {Array} words Array of choices
   * @return {String}       Randomly choosen element
   */
  var choose = function(words) {
    if (!words) throw new Error('Shouldnt be empty');

    var index = Math.floor(Math.random() * words.length);

    return words[index];
  };

  /**
   * Use a ngram model to generate sequences of text.
   *
   * @param  {Object} model Object containing data and settings/options for generating a sentence
   * @return {String}       Resulting sentence
   */
  var nlg = function(model) {
    if (!model) {
      return;
    }
    var maxLength = model.maxLength || 30;
    var sentence = ['.'];

    var keepGoing = function() {
      if (sentence[sentence.length - 1] !== '.') {
        return true;
      }
      if (sentence.length > maxLength) {
        return false;
      }
      return true;
    };

    var current;
    var next;

    while (keepGoing()) {
      current = sentence[sentence.length - 1];
      next = choose(model.data[current]);
      if (next) {
        sentence.push(next);
      }
    }
    sentence.shift();
    return sentence.join(' ').replace(/ \./g, '.');
  };

  exports.nlg = nlg;
  exports.generate = nlg;

})(typeof exports === 'object' ? exports : window);
