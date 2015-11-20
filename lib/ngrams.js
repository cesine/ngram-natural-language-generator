"use strict";

var fs = require('fs');
var readline = require('readline');

var tokenize = require('./tokenizer').tokenize;

var model = exports.NGRAM_MODEL || {};
var modelSize = 0;
var maxModelSize = 100;

/**
 * Build NGrams in model
 */
var addTokens = function(tokens, previous) {
  previous = previous || '.';

  // console.log('Line from file:', tokens);
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
  options.stream.on('line', function(line) {
    if (modelSize > maxModelSize) {
      console.log('ignoring line', line);
      if (typeof callback === "function") {
        callback(model);
      }
      callback = null;
      return;
    }
    var tokens = tokenize(line);
    previous = addTokens(tokens);
    modelSize += tokens.length;
  });

  options.stream.on('end', function(line) {
    // options.stream.close();
    // options.stream = null;

    if (!model[previous]) {
      model[previous] = ['.'];
    } else {
      model[previous].push('.');
    }
    console.log('model', model);
    if (typeof callback === "function") {
      callback(model);
    }
  });
};

exports.buildNgrams = buildNgrams;
