(function(exports) {
  /* globals  window */
  'use strict';

  var punctuationArray = [
    '\u0021-\u002C',
    '\u002E-\u002F',
    '\u003A-\u0040',
    '\u005B-\u0060',
    '\u007B-\u007E',
    '\u3031-\u3035',
    '\u3000-\u303f', // Japanese-style punctuation
    '\u309a-\u309e', // Hiragana punctuation
    '\u30fb-\u30ff', // Katakana punctuation
    '\uff00-\uff10',
    '\uff5e-\uff65',
    '\u309b', '\u309c',
    '\u30a0',
    '\u30fc',
    '\uff70',
    '\u2000-\u206F',
    '-',
    '='
  ];

  var sentenceDelimiter = new RegExp('([.?!])', 'g');

  var punctuation = new RegExp('([' + punctuationArray.join('') + '])', 'g');

  /**
   * Tokenizes a unicode text, ignoring unicode punctionation.
   *
   * @param  {String} text Text to be tokenized into (words)
   * @return {Array}      Array of tokens (words) in the text
   */
  var tokenize = function(text) {
    if (!text || !text.length || text.length < 1 || typeof text.replace !== 'function') {
      return [];
    }

    text = text
      .replace(sentenceDelimiter, ' sss ')
      .replace(punctuation, ' ')
      .trim();

    if (!text) {
      return [];
    }
    return text.split(/\s+/);
  };

  exports.tokenize = tokenize;

})(typeof exports === 'object' ? exports : window);
