[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

# ngram-natural-language-generator

Takes in text/file(s)/stream(s) and generates random sentences that sound like they could have been in the original text using a bigram generator.

# Usage

## Commandline

```
$ ./index.js samples/jaberwocky.txt
```

## Javascript

From file:

```
var generator = require('ngram-natural-language-generator');

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

```
var generator = require('ngram-natural-language-generator');

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

```
var generator = require('ngram-natural-language-generator');
var http = require('http');

http.get('http://www.jabberwocky.com/carroll/jabber/jabberwocky.html', function(res) {
	generator({
		stream: res
	}, function(err, sentence){
		console.log(sentence);
	});
});

```

# License

Copyright (c) 2015 cesine

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-url]: https://npmjs.org/package/ngram-natural-language-generator
[npm-image]: https://badge.fury.io/js/ngram-natural-language-generator.svg
[travis-url]: https://travis-ci.org/cesine/ngram-natural-language-generator
[travis-image]: https://travis-ci.org/cesine/ngram-natural-language-generator.svg?branch=master
[daviddm-url]: https://david-dm.org/cesine/ngram-natural-language-generator.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/cesine/ngram-natural-language-generator
