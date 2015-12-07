/* globals require, exports */
'use strict';

var choose = function(words) {
  if (!words) throw new Error('Shouldnt be empty');
  var index = Math.floor(Math.random() * words.length);
  // console.log('choosing ' + index + ' in ' + words);
  return words[index];
};

var generateText = function(model) {
  if (!model) {
    return;
  }
  // console.log('model in nlg', model.data);
  var maxLength = model.maxLength || 30;
  var minLength = model.minLength || 10;
  var sentence = ['.'];

  var keepGoing = function() {
    // console.log('looping', sentence[sentence.length - 1])
    if (sentence[sentence.length - 1] !== '.') {
      // console.log(' not the end');
      return true;
    }
    if (sentence.length > maxLength) {
      // console.log(' long enough');
      return false;
    }
    // console.log('continuing' + maxLength);
    return true;
  };

  var current;
  var next;

  while (keepGoing()) {
    current = sentence[sentence.length - 1];
    // console.log('current', current, 'sentence', sentence);
    next = choose(model.data[current]);
    // console.log('next', next);
    if (next) {
      sentence.push(next);
    }
    // console.log('sentence', sentence.length);
  }
  sentence.shift();
  return sentence.join(' ').replace(/ \./g, '.');
};

exports.generateText = generateText;
