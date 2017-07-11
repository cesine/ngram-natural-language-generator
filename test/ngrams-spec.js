'use strict';

var fs = require('fs');
var readline = require('readline');
var http = require('http');
var https = require('https');
var expect = require('chai').expect;

var ngrams = require('../lib/ngrams').ngrams;

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
    expect(ngrams).to.be.an('function');
  });

  describe('options', function() {

    it('should accept a tokenized text', function(done) {
      var options = {
        model: {
          maxSize: 100
        },
        tokens: ['how', 'i\'s', 'want', 's', 'is', 'how', '.']
      };

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data).to.deep.equal({
          '.': ['how'],
          'how': ['i\'s', '.'],
          'i\'s': ['want'],
          'want': ['s'],
          's': ['is'],
          'is': ['how']
        });
        expect(options.model.typeCount).to.equal(6);
        expect(options.model.tokenCount).to.equal(7);
        expect(options.model.maxSize).to.equal(100);
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

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data).to.deep.equal(TINY_MODEL);
        expect(options.model.typeCount).to.equal(6);
        expect(options.model.tokenCount).to.equal(6);
        expect(options.model.maxSize).to.equal(100);
        done();
      });
    });

    it('should not fail on has own properties', function(done) {
      var options = {
        model: {
          maxSize: 100
        },
        text: 'constructor prototype'
      };

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data).to.deep.equal({
          '.': ['constructor'],
          'constructor': ['prototype']
        });
        expect(options.model.typeCount).to.equal(2);
        expect(options.model.tokenCount).to.equal(2);
        expect(options.model.maxSize).to.equal(100);
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

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data.thought).to.deep.equal(['.', 'he']);
        expect(options.model.data.the).to.deep.equal(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey']);
        expect(options.model.typeCount).to.equal(69);
        expect(options.model.tokenCount).to.equal(101);
        expect(options.model.maxSize).to.equal(100);
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
      expect(options.stream).to.be.an('object');
      expect(options.stream.on).to.be.an('function');

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data.thought).to.deep.equal(['.', 'he']);
        expect(options.model.data.the).to.deep.equal(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey']);
        expect(options.model.typeCount).to.equal(69);
        expect(options.model.tokenCount).to.equal(101);
        expect(options.model.maxSize).to.equal(100);
        done();
      });
    });

    it('should accept a http stream', function(done) {
      http.get('http://www.jabberwocky.com/carroll/jabber/jabberwocky.html', function(res) {
        var options = {
          stream: res
        };
        expect(options.stream).to.be.an('object');
        expect(options.stream.on).to.be.an('function');

        ngrams(options, function(err, result) {
          expect(err).to.equal(null);
          expect(result).to.equal(options);
          expect(options.tokens).to.be.an('undefined');

          expect(options.model).to.be.an('object');
          expect(options.model.data.thought).to.deep.equal(['.', 'he']);
          expect(options.model.data.the).to.deep.equal(['Looking', 'slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey', 'Jabberwock', 'slithy', 'wabe', 'borogoves', 'mome']);
          expect(options.model.typeCount).to.equal(149);
          expect(options.model.tokenCount).to.equal(348);
          expect(options.model.maxSize).to.equal(10000);
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
      expect(options.stream).to.be.an('object');
      expect(options.stream.on).to.be.an('function');

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data.thought).to.deep.equal(['.', 'he']);
        expect(options.model.data.the).to.deep.equal(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey']);
        expect(options.model.typeCount).to.equal(69);
        expect(options.model.tokenCount).to.equal(101);
        expect(options.model.maxSize).to.equal(100);
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

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);
        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data.thought).to.deep.equal(['.', 'he']);
        expect(options.model.data.the).to.deep.equal(['slithy', 'wabe', 'borogoves', 'mome', 'Jabberwock', 'claws', 'Jubjub', 'manxome', 'Tumtum', 'tulgey', 'Jabberwock', 'slithy']);
        expect(options.model.typeCount).to.equal(96);
        expect(options.model.tokenCount).to.equal(166);
        expect(options.model.maxSize).to.equal(162);
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

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);

        options.text = "sleep furiously.";
        ngrams(options, function() {

          expect(result).to.equal(options);
          expect(options.tokens).to.be.an('undefined');

          expect(options.model).to.be.an('object');
          expect(options.model.data).to.deep.equal(TINY_MODEL);
          expect(options.model.typeCount).to.equal(6);
          expect(options.model.tokenCount).to.equal(6);
          expect(options.model.maxSize).to.equal(100);
          done();
        });
      });
    });

    it('should handle multiline sentences from stream', function(done) {
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

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);

        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data).to.deep.equal(TINY_MODEL);
        expect(options.model.typeCount).to.equal(6);
        expect(options.model.tokenCount).to.equal(6);
        expect(options.model.maxSize).to.equal(100);
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

      ngrams(options, function(err, result) {
        expect(err).to.equal(null);

        expect(result).to.equal(options);
        expect(options.tokens).to.be.an('undefined');

        expect(options.model).to.be.an('object');
        expect(options.model.data).to.deep.equal({
          '.': ['Colorless', 'sleep'],
          'Colorless': ['green'],
          'green': ['ideas'],
          'sleep': ['furiously'],
          'furiously': ['.']
        });
        expect(options.model.typeCount).to.equal(5);
        expect(options.model.tokenCount).to.equal(6);
        expect(options.model.maxSize).to.equal(100);
        done();
      });
    });
  });

  describe('language independant', function() {
    this.timeout(10 * 1000);
    it('should support Inuktitut', function(done) {
      https.get('https://www.sante-services-sociaux.ca/iu/offres-d-emploi', function(res) {
        // http.get('http://bibles.org/ike-EAIB/Num/26', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['ᖃᕆᑕᐅᔭᑎᒍᑦ']).to.deep.equal(['ᓯᓚᑎᑦᓴᔦᑦ', 'ᓯᓚᑎᑦᓴᔦᑦ', 'ᓯᓚᑎᑦᓴᔦᑦ', 'ᓯᓚᑎᑦᓴᔦᑦ', 'ᓯᓚᑎᑦᓴᔦᑦ', 'ᓯᓚᑎᑦᓴᔦᑦ']);
          expect(options.model.tokenCount).to.be.above(490);
          expect(options.model.typeCount).to.be.above(490);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(6);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Greek', function(done) {
      https.get('https://raw.githubusercontent.com/cesine/CorporaForFieldLinguistics/master/Greek/window.txt', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['δωμάτιο']).to.deep.equal(['.', 'το', 'είναι', 'κάβα', 'κάβα', 'κάβα', 'κάβα', 'κάβα', 'κάβα']);

          expect(options.model.tokenCount).to.be.equal(259);
          expect(options.model.typeCount).to.be.equal(150);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(1);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Cyrilic', function(done) {
      http.get('http://www.ewnc.org/node/20214', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['Вырубки']).to.deep.equal(['в', 'во', 'в', 'леса', 'леса']);

          expect(options.model.tokenCount).to.be.above(9000);
          expect(options.model.typeCount).to.be.above(1000);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(6);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Thai', function(done) {
      https.get('https://thai.tourismthailand.org/เกี่ยวกับประเทศไทย/เกี่ยวกับ-ททท', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['ที่พัก']).to.deep.equal(['สถานที่ท่องเที่ยว', 'โรงแรม', 'ที่พัก', 'a']);

          expect(options.model.tokenCount).to.be.above(800);
          expect(options.model.typeCount).to.be.above(200);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(3);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Korean', function(done) {
      http.get('http://www.pro-face.com/otasuke_ko/qa/gp3000/prtl/error_e.htm', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['포트']).to.deep.equal(['번호', '번호가']);

          expect(options.model.tokenCount).to.be.above(2000);
          expect(options.model.typeCount).to.be.above(400);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(6);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Georgian', function(done) {
      https.get('https://raw.githubusercontent.com/batumi/SamartlosSakonstitutsioSasamartdoSarke/master/files/sarchelebi/558_24_06_2013.txt', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['ადასტურებენ']).to.deep.equal(['სადავო', 'შუამდგომლობის']);

          expect(options.model.tokenCount).to.be.above(3000);
          expect(options.model.typeCount).to.be.above(1000);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(2);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support urdu', function(done) {
      https.get('https://raw.githubusercontent.com/cesine/CorporaForFieldLinguistics/master/Urdu/urdublogging.html', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['لینکس']).to.deep.equal(['انسٹال', 'کا', 'انسٹال', 'کا']);

          expect(options.model.tokenCount).to.be.above(4000);
          expect(options.model.typeCount).to.be.above(800);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(5);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Japanese', function(done) {
      https.get('https://raw.githubusercontent.com/iLanguage/JapaneseCorpusAngoSakaguchi/master/corpus/ango1.txt', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).to.equal(null);

          // console.log(options.model);
          expect(options.model).to.be.an('object');

          expect(options.model.data['が']).to.deep.equal(['その酩酊状態を愛することによって']);

          expect(options.model.tokenCount).to.be.above(900);
          expect(options.model.typeCount).to.be.above(900);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).to.equal(1);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });
  });
});
