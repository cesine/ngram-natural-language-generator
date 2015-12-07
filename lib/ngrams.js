/* globals require, exports */
'use strict';

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var tokenize = require('./tokenizer').tokenize;

/**
 * Add tokens into a (bi)gram model
 *
 * @param {Object} options an object containing sequential tokens which can be aded to the model
 */
var addTokens = function(options) {
  if (!options.tokens || !options.tokens.length) return;

  options.previous = options.previous || '.';

  var ignoringInput = false;

  options.tokens.map(function(token) {
    if (!token) {
      return options.previous;
    }

    if (token === 'sss') {
      token = '.';
    }

    if (!options.model.data[options.previous]) {
      options.model.data[options.previous] = [token];
      options.model.typeCount++;
    } else {
      options.model.data[options.previous].push(token);
    }

    options.previous = token;
  });

  options.model.tokenCount += options.tokens.length;
  delete options.tokens;
  return options.previous;
};

var isReadableStream = function(obj) {
  if (!obj) {
    return;
  }
  return obj instanceof stream.Stream &&
    typeof obj._read === 'function' &&
    typeof obj._readableState === 'object';
};

/**
 * Add data to a model or create a model if none existed.
 * Accepts
 *  - Array of sequential tokenized text
 *  - Text
 *  - Filename
 *  - Readable stream (eg, http request)
 *  - Readline stream
 *
 * @param {Object}   options  Options with which to generate the model
 * @param {Function} callback Recieves err, or options upon completion
 */
var add = function(options, callback) {
  options.model = options.model || {};
  options.model.data = options.model.data || {};
  options.model.typeCount = options.model.typeCount || 0;
  options.model.tokenCount = options.model.tokenCount || 0;
  options.model.maxSize = options.model.maxSize || 10000;

  if (options.tokens) {
    addTokens(options);
    delete options.tokens;
  }
  if (options.text) {
    options.tokens = tokenize(options.text);
    addTokens(options);
    delete options.text;
  }
  if (options.filename) {
    options.stream = readline.createInterface({
      input: fs.createReadStream(options.filename)
    });
    delete options.filename;
  }

  if (!options.stream) {
    if (callback && typeof callback === "function") {
      callback(null, options);
    }
    return;
  }

  if (isReadableStream(options.stream)) {
    options.stream = readline.createInterface({
      input: options.stream
    });
  }

  /**
   * Clean up stream and terminate model so that it can loop.
   * @return {Function}      Callback for (err, options) when (this itteration) of adding data to the model is finished
   */
  var done = function() {
    if (options.previous !== '.') {
      if (!options.model.data[options.previous]) {
        options.model.data[options.previous] = ['.'];
      } else {
        options.model.data[options.previous].push('.');
      }
    }

    delete options.tokens;
    options.stream.close();
    if (typeof callback === "function") {
      callback(null, options);
    }
    callback = null;
  };

  /**
   * Tokenize each line and add it to the model
   *
   * @param  {String} line string sequence of words
   */
  var lineListener = function(line) {
    if (options.model.tokenCount >= options.model.maxSize) {
      done();
      return;
    }
    options.tokens = tokenize(line);
    var currentPrevious = addTokens(options);
    if (currentPrevious !== options.previous) {
      options.previous = currentPrevious;
    }
  };

  options.stream.on('line', lineListener);
  options.stream.on('end', done);
  options.stream.on('close', done);
  options.stream.on('error', done);
};

exports.add = add;
