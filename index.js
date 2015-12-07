#!/usr/local/bin/node

var ngrams = require('./lib/ngrams').add;
var nlg = require('./lib/nlg').generateText;

var generator = function(options, callback) {
  ngrams(options, function(err, result) {
    if (err) callback(err);

    // console.log('Generated options.model ', options.model);

    var sentence = nlg(options.model);
    // console.log(sentence);
    if (typeof callback === "function") {
      callback(null, sentence);
    }
  });

};

if (require.main === module) {
  if (process.argv && process.argv.length > 2) {
    generator({
      filename: process.argv[2]
    }, function(err, sentence) {
      if (err) {
        console.log(err.stack);
        return process.exit(1);
      }
      console.log('\n\n' + sentence + '\n\n');
    });
  }
} else {
  exports.generator = generator;
}
