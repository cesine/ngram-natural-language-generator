'use strict';

var fs = require('fs');
var readline = require('readline');
var http = require('http');
var https = require('https');

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

      ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
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

        ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
        expect(err).toBeNull();

        options.text = "sleep furiously.";
        ngrams(options, function() {

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

      ngrams(options, function(err, result) {
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

      ngrams(options, function(err, result) {
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

  describe('language independant', function() {
    it('should support Inuktitut', function(done) {
      http.get('http://www.sante-services-sociaux.ca/iu/offres-d-emploi/agent-e-planification-programmation-enfance-jeunesse-famille_1028245518', function(res) {
        // http.get('http://bibles.org/ike-EAIB/Num/26', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['ᓄᓇᕕᒻᒥ']).toEqual(['ᓄᓇᓕᓕᒫᓂ', 'ᐊᒻᒪᓗ', 'ᐃᓗᓯᓕᕆᔨᒃᑯᑦ', 'ᓄᓇᓕᓕᒫᓂ', 'ᓄᓇᓕᓕᒫᓂ']);
          expect(options.model.tokenCount).toBeGreaterThan(1000);
          expect(options.model.typeCount).toBeGreaterThan(600);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(3);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Greek', function(done) {
      http.get('http://www.tilestwra.com/se-afto-to-spiti-iparchi-ena-parathiro-sto-patoma-dite-giati/', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['της']).toEqual(['Συρίας', 'Ρωσίας', 'Ρωσίας', 'Ρωσίας', 'Ρωσίας', 'Ρωσίας', 'Ρωσίας', 'TILESTWRA', 'κόρης', 'κόρης', 'κόρης', 'Ρωσίας', 'Ρωσίας']);

          expect(options.model.tokenCount).toBeGreaterThan(8000);
          expect(options.model.typeCount).toBeGreaterThan(1000);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(6);
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
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['Вырубки']).toEqual(['в', 'во', 'в', 'леса', 'леса']);

          expect(options.model.tokenCount).toBeGreaterThan(9000);
          expect(options.model.typeCount).toBeGreaterThan(1000);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(6);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should support Thai', function(done) {
      http.get('http://thai.tourismthailand.org/เกี่ยวกับประเทศไทย/เกี่ยวกับ-ททท', function(res) {
        var options = {
          stream: res
        };

        ngrams(options, function(err) {
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['ที่พัก']).toEqual(['สถานที่ท่องเที่ยว', 'โรงแรม', 'ที่พัก', 'a']);

          expect(options.model.tokenCount).toBeGreaterThan(800);
          expect(options.model.typeCount).toBeGreaterThan(200);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(3);
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
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['포트']).toEqual(['번호', '번호가']);

          expect(options.model.tokenCount).toBeGreaterThan(2000);
          expect(options.model.typeCount).toBeGreaterThan(400);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(6);
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
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['ადასტურებენ']).toEqual(['სადავო', 'შუამდგომლობის']);

          expect(options.model.tokenCount).toBeGreaterThan(3000);
          expect(options.model.typeCount).toBeGreaterThan(1000);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(2);
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
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['لینکس']).toEqual(['انسٹال', 'کا', 'انسٹال', 'کا']);

          expect(options.model.tokenCount).toBeGreaterThan(4000);
          expect(options.model.typeCount).toBeGreaterThan(800);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(5);
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
          expect(err).toBeNull();

          // console.log(options.model);
          expect(options.model).toBeDefined();

          expect(options.model.data['が']).toEqual(['その酩酊状態を愛することによって']);

          expect(options.model.tokenCount).toBeGreaterThan(900);
          expect(options.model.typeCount).toBeGreaterThan(900);
          expect(Math.floor(options.model.tokenCount / options.model.typeCount)).toEqual(1);
          done();
        });
      }).on('error', function(err) {
        console.error(err);
        done(err);
      });
    });
  });
});
