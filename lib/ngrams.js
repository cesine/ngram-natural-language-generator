/* globals require, exports */
'use strict';

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var tokenize = require('./tokenizer').tokenize;

/**
 * Build NGrams in model
 */
var addTokens = function(options) {
  if (!options.tokens || !options.tokens.length) return;

  options.previous = options.previous || '.';

  var ignoringInput = false;

  // console.log(options.previous + ' :', options.tokens);
  options.tokens.map(function(token) {
    if (!token) {
      return options.previous;
    }
    if (token === 'sss') {
      token = '.';
    }
    // console.log('current model ', options.model);
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
    // console.log('done.')
    if (callback && typeof callback === "function") {
      callback(null, options);
    }
    return;
  }

  // console.log(' stream is readable ', isReadableStream(options.stream));

  if (isReadableStream(options.stream)) {
    // console.log('turning stream into a readline interface')
    options.stream = readline.createInterface({
      input: options.stream
    });
  }

  var done = function(line) {
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
      // console.log('end of stream');
      callback(null, options);
    }
    callback = null;
  };
  // console.log('reading from stream')
  var lineListener = function(line) {
    // console.log('got a line ' + line)
    if (options.model.tokenCount >= options.model.maxSize) {
      // console.log('ignoring line ', line);
      done();
      return;
    }
    if (!line) {
      // console.log(' line was empty.');
      // done();
    }
    options.tokens = tokenize(line);
    var currentPrevious = addTokens(options);
    if (currentPrevious !== options.previous) {
      options.previous = currentPrevious;
    }
    // console.log('', options.previous);
  };
  options.stream.on('line', lineListener);

  options.stream.on('end', done);
  options.stream.on('close', done);
  options.stream.on('error', done);
};

exports.add = add;
