'use strict';

var nlg = require('../lib/nlg').nlg;
var expect = require('chai').expect;

var TINY_MODEL = {
  '.': ['Colorless'],
  'Colorless': ['green'],
  'green': ['ideas'],
  'ideas': ['sleep'],
  'sleep': ['furiously'],
  'furiously': ['.']
};

describe('nlg', function() {

  it('should load', function() {
    expect(nlg).to.be.a('function');
  });

  describe('options', function() {

    it('should support sentence length', function() {
      var sentence = nlg({
        data: TINY_MODEL,
        maxLength: 12,
        minLength: 5
      });

      expect(sentence).to.equal('Colorless green ideas sleep furiously. Colorless green ideas sleep furiously.');
    });

    it('should support sentence length', function() {
      var sentence = nlg({
        data: TINY_MODEL,
        maxLength: 3,
        minLength: 1
      });

      expect(sentence).to.equal('Colorless green ideas sleep furiously.');
    });

  });
});
