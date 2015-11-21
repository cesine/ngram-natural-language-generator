"use strict";

var fs = require('fs');
var readline = require('readline');

var tokenize = require('./tokenizer').tokenize;

var model = exports.NGRAM_MODEL || {};
var modelSize = 0;
var maxModelSize = 100;
var ignoringInput = false;

/**
 * Build NGrams in model
 */
var addTokens = function(tokens, previous) {
  previous = previous || '.';

  console.log(previous + ' Line from file:', tokens);
  tokens.map(function(token) {
    if (!token) {
      return previous;
    }
    if (token === 'sss') {
      token = '.';
    }
    // console.log('looking at ', model);
    if (!model[previous]) {
      model[previous] = [token];
    } else {
      model[previous].push(token);
    }
    previous = token;
  });

  return previous;
};

var endInput = function(previous) {
  if (!model[previous]) {
    model[previous] = ['.'];
  } else {
    model[previous].push('.');
  }
};

var buildNgrams = function(options, callback) {
  if (!options) {
    if (typeof callback === "function") {
      callback(model);
    }
    return;
  }
  if (options.tokenized) {
    addTokens(options.tokenized);
    if (typeof callback === "function") {
      callback(model);
    }
    return;
  }
  if (options.text) {
    var tokens = tokenize(options.text);
    addTokens(tokens);
    if (typeof callback === "function") {
      callback(model);
    }
    return;
  }
  if (!options.filename && !options.stream) {
    if (typeof callback === "function") {
      callback(model);
    }
    return;
  }
  if (!options.stream) {
    options.stream = readline.createInterface({
      input: fs.createReadStream(options.filename)
    });
  }

  var previous;
  var lineListener = function(line) {
    if (modelSize > maxModelSize) {
      console.log('ignoring line', line);
      if (typeof callback === "function") {
        callback(model, previous);
        callback = null;
      }
      return;
    }
    var tokens = tokenize(line);
    var currentPrevious =  addTokens(tokens);
    if (currentPrevious !== previous){
      previous = currentPrevious;
    }
    console.log('', previous);
    modelSize += tokens.length;
  };
  options.stream.on('line', lineListener);

  options.stream.on('end', function(line) {
    if (typeof callback === "function") {
      callback(model, previous);
    }
  });
};

exports.buildNgrams = buildNgrams;
