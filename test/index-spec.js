'use strict';

var ngramNaturalLanguageGenerator = require('../').generator;

describe('ngram natural language generator', function() {

	it('should load', function() {
		expect(ngramNaturalLanguageGenerator).toBeDefined();
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

				expect(err).toBeNull();
				expect(sentence).toBeDefined();
				console.log('result ', sentence);
				expect(sentence).toContain(' ');
				expect(sentence.split(' ').length >= 1).toBeTruthy();

				done();
			});
		});
	});
});
