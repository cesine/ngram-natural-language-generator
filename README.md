[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

# ngram-natural-language-generator

Takes in text/file(s)/stream(s) and generates random sentences that sound like they could have been in the original text using a bigram generator. Surprisingly works on most languages and writing styles.

You can experiment with your own texts here http://cesine.github.io/ngram-natural-language-generator/samples

<img width="400" alt="screen shot 2015-12-07 at 1 28 34 am" src="https://cloud.githubusercontent.com/assets/196199/11620487/74c0a5ca-9c81-11e5-8598-860556569205.png">
<img width="400" alt="screen shot 2015-12-07 at 9 09 01 pm" src="https://cloud.githubusercontent.com/assets/196199/11645948/9fbc08c8-9d26-11e5-81af-07591e4e2501.png">


# Usage

## Commandline

```bash
$ npm install ngram-natural-language-generator --save
$ ./index.js samples/jaberwocky.txt
```

## Browser

```bash
$ bower install ngram-natural-language-generator --save
```

There is an example browser use in [samples/index.html](samples/index.html).

```html
<textarea id="ngram-nlg-text"></textarea>
<textarea id="ngram-nlg-result"></textarea>

<script>
	window.NLG = window.exports = window.exports || {};
</script>

<script src="bower_components/ngram-natural-language-generator/lib/tokenizer.js"></script>
<script src="bower_components/ngram-natural-language-generator/lib/nlg.js"></script>
<script src="bower_components/ngram-natural-language-generator/lib/ngrams.js"></script>
<script src="bower_components/ngram-natural-language-generator/lib/ngram-nlg.js"></script>
<script src="bower_components/ngram-natural-language-generator/lib/drag-and-drop-file-upload.js"></script>

<script>
	NLG.currentOptions  = {
		text: ''
	};
	NLG.currentOptions.text = document.getElementById('ngram-nlg-text').value;
	NLG.build(NLG.currentOptions, function(err, result){
		if (err) return console.warn(err);
		document.getElementById('ngram-nlg-result').value = NLG.generate(NLG.currentOptions.model);
	});
</script>

```

## Node

From file:

```javascript
var generator = require('ngram-natural-language-generator').generator;

generator({
	filename: 'samples/jabberwocky.txt',
	model: {
		maxLength: 100,
		minLength: 50
	}
}, function(err, sentence){
	console.log(sentence);
	// One two. Callooh. Beware the borogoves And the claws that bite the Jabberwock my
	// beamish boy. One two. One two. And through the mome raths outgrabe. And stood The
	// frumious Bandersnatch. He took his joy. And the borogoves And the claws that bite the
	// wabe All mimsy were the Jabberwock with eyes of flame Came whiffling through and the
	// slithy toves Did gyre and through The Jabberwock. Twas brillig and shun The Jabberwock
	// my son. Beware the borogoves And the mome raths outgrabe. Beware the Jabberwock. Come
	// to my son.
});
```

From text:

```javascript
var generator = require('ngram-natural-language-generator').generator;

generator({
	text: 'Colorless green ideas sleep furiously.',
	model: {
		maxLength: 100,
		minLength: 50
	}
}, function(err, sentence){
	console.log(sentence);
});
```

From web url:

```javascript
var generator = require('ngram-natural-language-generator').generator;
var http = require('http');

http.get('http://www.jabberwocky.com/carroll/jabber/jabberwocky.html', function(res) {
	generator({
		stream: res
	}, function(err, sentence){
		console.log(sentence);
	});
});

```

From tokens:

If you're working with a language which doesn't tokenize on whitespace or unicode punctionation you can supply the tokens.


```javascript
var generator = require('ngram-natural-language-generator').generator;

generator({
	tokens: ['その', '酩酊', '状態を', '愛する', 'ことに', 'よって'],
	model: {
		maxLength: 100,
		minLength: 50
	}
}, function(err, sentence){
	console.log(sentence);
});
```

[npm-url]: https://npmjs.org/package/ngram-natural-language-generator
[npm-image]: https://badge.fury.io/js/ngram-natural-language-generator.svg
[travis-url]: https://travis-ci.org/cesine/ngram-natural-language-generator
[travis-image]: https://travis-ci.org/cesine/ngram-natural-language-generator.svg?branch=master
[daviddm-url]: https://david-dm.org/cesine/ngram-natural-language-generator.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/cesine/ngram-natural-language-generator
