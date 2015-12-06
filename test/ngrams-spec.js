var fs = require('fs');
var readline = require('readline');
var http = require('http');
var stream = require('stream');

var ngrams = require('../lib/ngrams');

var TINY_MODEL = {
	'.': ['Colorless'],
	'Colorless': ['green'],
	'green': ['ideas'],
	'ideas': ['sleep'],
	'sleep': ['furiously'],
	'furiously': ['.']
};

describe('ngrams', function() {

	it('should load', function() {
		expect(ngrams).toBeDefined();
	});

	describe('options', function() {

		it('should accept a tokenized text', function(done) {
			var options = {
				model: {
					maxSize: 100
				},
				tokens: ['how', 'i\'s', 'want', 's', 'is', 'how', '.']
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();
				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data).toEqual({
					'.': ['how'],
					'how': ['i\'s', '.'],
					'i\'s': ['want'],
					'want': ['s'],
					's': ['is'],
					'is': ['how']
				});
				expect(options.model.typeCount).toEqual(6);
				expect(options.model.tokenCount).toEqual(7);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});

		it('should accept a text', function(done) {
			var options = {
				model: {
					maxSize: 100
				},
				text: 'Colorless green ideas sleep furiously.'
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();
				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data).toEqual(TINY_MODEL);
				expect(options.model.typeCount).toEqual(6);
				expect(options.model.tokenCount).toEqual(6);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});

		it('should accept a filename', function(done) {
			var options = {
				model: {
					maxSize: 100
				},
				filename: 'samples/jabberwocky.txt'
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();
				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data.thought).toEqual(['.', 'he']);
				expect(options.model.data.the).toEqual(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey']);
				expect(options.model.typeCount).toEqual(69);
				expect(options.model.tokenCount).toEqual(101);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});

		it('should accept a read stream', function(done) {
			var options = {
				model: {
					maxSize: 100
				},
				stream: fs.createReadStream('samples/jabberwocky.txt')
			};
			expect(options.stream).toBeDefined();
			expect(options.stream.on).toBeDefined();

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();
				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data.thought).toEqual(['.', 'he']);
				expect(options.model.data.the).toEqual(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey']);
				expect(options.model.typeCount).toEqual(69);
				expect(options.model.tokenCount).toEqual(101);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});

		it('should accept a http stream', function(done) {
			http.get('http://www.jabberwocky.com/carroll/jabber/jabberwocky.html', function(res) {
				var options = {
					stream: res
				};
				expect(options.stream).toBeDefined();
				expect(options.stream.on).toBeDefined();

				ngrams.add(options, function(err, result) {
					expect(err).toBeNull();
					expect(result).toEqual(options);
					expect(options.tokens).toBeUndefined();

					expect(options.model).toBeDefined();
					expect(options.model.data.thought).toEqual(['.', 'he']);
					expect(options.model.data.the).toEqual(['Looking', 'slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey', 'Jabberwock', 'slithy', 'wabe', 'borogoves', 'mome']);
					expect(options.model.typeCount).toEqual(149);
					expect(options.model.tokenCount).toEqual(348);
					expect(options.model.maxSize).toEqual(10000);
					done();
				});
			});
		});

		it('should accept a commandline stream', function(done) {
			var options = {
				model: {
					maxSize: 100
				},
				stream: readline.createInterface({
					input: fs.createReadStream('samples/jabberwocky.txt')
				})
			};
			expect(options.stream).toBeDefined();
			expect(options.stream.on).toBeDefined();

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();
				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data.thought).toEqual(['.', 'he']);
				expect(options.model.data.the).toEqual(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey']);
				expect(options.model.typeCount).toEqual(69);
				expect(options.model.tokenCount).toEqual(101);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});
	});

	describe('model', function() {
		it('should accept a max size', function(done) {
			var options = {
				model: {
					maxSize: 162
				},
				filename: 'samples/jabberwocky.txt'
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();
				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data.thought).toEqual(['.', 'he']);
				expect(options.model.data.the).toEqual(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey', 'Jabberwock', 'slithy']);
				expect(options.model.typeCount).toEqual(96);
				expect(options.model.tokenCount).toEqual(166);
				expect(options.model.maxSize).toEqual(162);
				done();
			});
		});
	});

	describe('wrap lines', function() {

		it('should handle multiline sentences', function(done) {
			var options = {
				model: {
					maxSize: 100
				},
				text: 'Colorless green ideas'
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();

				options.text = "sleep furiously."
				ngrams.add(options, function() {

					expect(result).toEqual(options);
					expect(options.tokens).toBeUndefined();

					expect(options.model).toBeDefined();
					expect(options.model.data).toEqual(TINY_MODEL);
					expect(options.model.typeCount).toEqual(6);
					expect(options.model.tokenCount).toEqual(6);
					expect(options.model.maxSize).toEqual(100);
					done();
				});
			});
		});

		it('should handle multiline sentences', function(done) {
			var out = fs.createWriteStream('temp.txt');
			out.write('Colorless green ideas\n');
			out.write('sleep furiously.\n');
			out.end();

			var options = {
				model: {
					maxSize: 100
				},
				stream: fs.createReadStream('temp.txt')
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();

				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data).toEqual(TINY_MODEL);
				expect(options.model.typeCount).toEqual(6);
				expect(options.model.tokenCount).toEqual(6);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});

		it('should use double line breaks as sentential boundaries', function(done) {
			var out = fs.createWriteStream('temp.txt');
			out.write('Colorless green ideas\n');
			out.write('\n');
			out.write('sleep furiously.\n');
			out.end();

			var options = {
				model: {
					maxSize: 100
				},
				stream: fs.createReadStream('temp.txt')
			};

			ngrams.add(options, function(err, result) {
				expect(err).toBeNull();

				expect(result).toEqual(options);
				expect(options.tokens).toBeUndefined();

				expect(options.model).toBeDefined();
				expect(options.model.data).toEqual({
					'.': ['Colorless', 'sleep'],
					'Colorless': ['green'],
					'green': ['ideas'],
					'sleep': ['furiously'],
					'furiously': ['.']
				});
				expect(options.model.typeCount).toEqual(5);
				expect(options.model.tokenCount).toEqual(6);
				expect(options.model.maxSize).toEqual(100);
				done();
			});
		});
	});
});
