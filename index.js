#!/usr/local/bin/node

var ngrams = require('./lib/ngrams').ngrams;
var nlg = require('./lib/nlg').nlg;

var generator = function(options, callback) {
  ngrams(options, function(err, result) {
    if (err) callback(err);

    var sentence = nlg(options.model);
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
