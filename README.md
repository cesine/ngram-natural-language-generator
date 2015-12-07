# ngram-natural-language-generator
Takes in a text file and generates random sentences that sound like they could have been in the file


# Usage

Commandline

```
$ ./index.js samples/jaberwocky.txt
```

NPM module

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
