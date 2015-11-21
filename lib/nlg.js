"use strict";

var choose = function(words) {
  if (!words) throw new Error('Shouldnt be empty');
  var index = Math.floor(Math.random() * words.length);
  console.log('choosing ' + index + ' in ' + words);
  return words[index];
};

var generateText = function(options) {
  if (!options) {
    return;
  }
  console.log('model in nlg', options.model);
  var maxLength = options.maxLength || 30;
  var minLength = options.minLength || 10;
  var sentence = ['.'];

  var keepGoing = function() {
    // console.log('looping', sentence[sentence.length - 1])
    if (sentence[sentence.length - 1] !== '.') {
      // console.log(' not the end');
      return true;
    }
    if (sentence.length > options.maxLength) {
      console.log(' long enough');
      return false;
    }
    console.log('continuing');
    return true;
  };

  var current;
  var next;

  while (keepGoing()) {
    current = sentence[sentence.length - 1];
    // console.log('current', current, 'sentence', sentence);
    next = choose(options.model[current]);
    console.log('next', next);
    if (next) {
      sentence.push(next);
    }
    // console.log('sentence', sentence);
  }

  return sentence.join(' ');
};

exports.generateText = generateText;
