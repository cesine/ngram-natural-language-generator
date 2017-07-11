'use strict';

var ngramNaturalLanguageGenerator = require('../').generator;
var expect = require('chai').expect;

describe('ngram natural language generator', function() {

  it('should load', function() {
    expect(ngramNaturalLanguageGenerator).to.be.an('function');
  });

  describe('options', function() {

    it('should support sentence length', function(done) {
      var options = {
        filename: 'samples/jabberwocky.txt',
        model: {
          maxLength: 3,
          minLength: 1
        }
      };
      ngramNaturalLanguageGenerator(options, function(err, sentence) {

        expect(err).to.equal(null);
        expect(sentence).to.be.an('string');
        console.log('result ', sentence);
        expect(sentence).to.contain(' ');
        expect(sentence.split(' ').length >= 1).to.equal(true);

        done();
      });
    });
  });
});
