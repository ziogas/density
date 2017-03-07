/**
 * Density v0.1.0
 * MIT licensed
 *
 * Copyright (C) 2012 usabli.ca - By Afshin Mehrabani
 */ 
 (function () {
  //Default config/variables
  var VERSION = "0.1.0";
  //Check for nodeJS
  var hasModule = (typeof module !== 'undefined' && module.exports);
  //import node modules
  var fs = require('fs');

  /**
   * Density main class
   *
   * @class Density
   */
  function Density(str) {
    this._str = str.toLowerCase();

    //default options
    this._options = {
      stopWordFile: __dirname + "/stopwords.json",
      minKeywordLength: 2,
      maxKeywordLength: 50,
      maxWordsInKeyword: 1,
      removePunctuation: false
    };
  }

  /**
   * Remove all stop words from the text from given setting file
   *
   * @method _removeStopWords
   */
  function _removeStopWords() {
    var fileData = fs.readFileSync(this._options.stopWordFile, 'utf8').toLowerCase();
    var stopwords = JSON.parse(fileData);
    for (var i = stopwords.length - 1; i >= 0; i--) {
      var regex  = new RegExp("( |^)" + stopwords[i].replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1") + "( |$)", "g");
      this._str = this._str.replace(regex, "$1$2");
    };
  }

  /**
   * Remove all punctuation
   *
   * @method _removePunctuation
   */
  function _removePunctuation() {
    this._str = this._str.replace(/[\-=_!"#%&'*{},\.\/:;?\(\)\[\]@\\$\^*+<>~`\u00a1\u00a7\u00b6\u00b7\u00bf\u037e\u0387\u055a-\u055f\u0589\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0af0\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f14\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u166d\u166e\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u1805\u1807-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cc0-\u1cc7\u1cd3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203b-\u203e\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205e\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00\u2e01\u2e06-\u2e08\u2e0b\u2e0e-\u2e16\u2e18\u2e19\u2e1b\u2e1e\u2e1f\u2e2a-\u2e2e\u2e30-\u2e39\u3001-\u3003\u303d\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uaaf0\uaaf1\uabeb\ufe10-\ufe16\ufe19\ufe30\ufe45\ufe46\ufe49-\ufe4c\ufe50-\ufe52\ufe54-\ufe57\ufe5f-\ufe61\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff07\uff0a\uff0c\uff0e\uff0f\uff1a\uff1b\uff1f\uff20\uff3c\uff61\uff64\uff65]+/g,"");
  }

  /**
   * Convert HTML to Text
   * Thanks to: https://github.com/mtrimpe/jsHtmlToText
   *
   * @method _htmlToText
   */
  function _htmlToText() {
    var text = this._str;

    text = text
    // Remove line breaks
    .replace(/(?:\n|\r\n|\r)/ig, " ")
    // Remove content in script tags.
    .replace(/<\s*script[^>]*>[\s\S]*?<\/script>/mig, "")
    // Remove content in style tags.
    .replace(/<\s*style[^>]*>[\s\S]*?<\/style>/mig, "")
    // Remove content in comments.
    .replace(/<!--.*?-->/mig, "")
    // Remove !DOCTYPE
    .replace(/<!DOCTYPE.*?>/ig, "");

    /* I scanned http://en.wikipedia.org/wiki/HTML_element for all html tags.
    I put those tags that should affect plain text formatting in two categories:
    those that should be replaced with two newlines and those that should be
    replaced with one newline. */
    var doubleNewlineTags = ['p', 'h[1-6]', 'dl', 'dt', 'dd', 'ol', 'ul', 'dir', 'address', 'blockquote', 'center', 'div', 'hr', 'pre', 'form', 'textarea', 'table'];

    var singleNewlineTags = ['li', 'del', 'ins', 'fieldset', 'legend','tr', 'th', 'caption', 'thead', 'tbody', 'tfoot'];

    for (var i = 0; i < doubleNewlineTags.length; i++) {
      var r = RegExp('</?\\s*' + doubleNewlineTags[i] + '[^>]*>', 'ig');
      text = text.replace(r, ' ');
    }

    for (var i = 0; i < singleNewlineTags.length; i++) {
      var r = RegExp('<\\s*' + singleNewlineTags[i] + '[^>]*>', 'ig');
      text = text.replace(r, ' ');
    }

    // Replace <br> and <br/> with a single newline
    text = text.replace(/<\s*br[^>]*\/?\s*>/ig, ' ');

    text = text
    // Remove all remaining tags.
    .replace(/(<([^>]+)>)/ig, "")
    // Trim rightmost whitespaces for all lines
    .replace(/([^\n\S]+)\n/g, " ")
    .replace(/([^\n\S]+)$/, "")
    // Make sure there are never more than two
    // consecutive linebreaks.
    .replace(/\n{2,}/g, " ")
    // Remove newlines at the beginning of the text.
    .replace(/^\n+/, "")
    // Remove newlines at the end of the text.
    .replace(/\n+$/, "")
    // Remove HTML entities.
    .replace(/&([^;]+);/g, ' ')
    //remove all tabs and replace them with whitespace
    .replace(/\t/g, " ")
    //remove whitespace > 2
    .replace(/ {2,}/g, " ");

    this._str = text;
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  function _mergeOptions(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  }

  /**
   * Calculate keyword density in the given text
   *
   * @method _calculateKeywordsDensity
   * @return {Object} Keywords density
   */
  function _calculateKeywordsDensity() {
    //convert html to text
    _htmlToText.call(this);

    //remove all stop words
    _removeStopWords.call(this);

    if (this._options.removePunctuation) {
        //remove punctuation
        _removePunctuation.call(this);
    }

    //split the text with space, can be continuous space too
    var words = this._str.split(/\s+/);
    var density = [];
    var phrases = [];
    var phrase = [];

    var maxWordsInKeyword = this._options.maxWordsInKeyword;

    // If there is need to have multiple words in keyword
    if (this._options.maxWordsInKeyword > 1) {

        while (maxWordsInKeyword > 1) {
            for (var i=0; i<words.length; i++) {
                phrase = [words[i]];

                for (var x=1; x<maxWordsInKeyword; x++) {
                    if (words[i+x]) {
                        phrase.push(words[i+x]);
                    }
                }

                // Ensure that 3 words phrase would be 3 words phrase
                if (phrase && phrase.length === maxWordsInKeyword) {
                    phrases.push(phrase.join(" "));
                }
            }

            maxWordsInKeyword -= 1;
        }

        if (phrases && phrases.length) {
            for (var i=0; i<phrases.length; i++) {
                words.push(phrases[i]);
            }
        }
    }

    for (var i = words.length - 1; i >= 0; i--) {
      if (words[i].length <= this._options.minKeywordLength || words[i].length >= this._options.maxKeywordLength)
        continue;

      keywordCombinations = [];
      for (var x=0; x<this._options.maxWordsInKeyword; x++) {
          if (words[i+x]) {
              keywordCombinations.push(words[i]);
              if (x>0) {
                keywordCombinations.push(keywordCombinations[keywordCombinations.length-2] +' '+words[i]);
              }
          }
      }
    }




    //sort the array
    words = words.sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    //used for store the word count
    var currentWordCount = 1;
    for (var i = words.length - 1; i >= 0; i--) {
      if (words[i].length <= this._options.minKeywordLength || words[i].length >= this._options.maxKeywordLength)
        continue;

      if (words[i] == words[i - 1]) {
        //a new duplicate keyword
        ++currentWordCount;
      } else {
        //add the keyword with density to the array
        density.push({
          word: words[i],
          count: currentWordCount
        });
        //reset the keyword density counter
        currentWordCount = 1;
      }

    }
    //sort the array with density of keywords
    density = density.sort(function (a, b) {
      if (a.count > b.count) return -1;
      if (a.count < b.count) return 1;
      return 0;
    });

    return density;
  }

  var density = function (inputStr) {
    if (inputStr === "" || inputStr === null) {
      return null;
    }
    return new Density(inputStr);
  };

  /**
   * Current Density version
   *
   * @property version 
   * @type String
   */
  density.version = VERSION;

  //Prototype
  density.fn = Density.prototype = {
    clone: function () {
      return new Density(this);
    },
    value: function () {
      return this._str;
    },
    toString: function () {
      return this._str.toString();
    },
    set: function (value) {
      this._str = String(value);
      return this;
    },
    setOption: function (option, value) {
      this._options[option] = value;
      return this;
    },
    setOptions: function (options) {
      this._options = _mergeOptions(this._options, options);
      return this;
    },
    getDensity: function () {
      return _calculateKeywordsDensity.call(this);
    }
  };

  //Expose Density
  //CommonJS module is defined
  if (hasModule) {
    module.exports = density;
  }
  //global ender:false
  if (typeof ender === 'undefined') {
    // here, `this` means `window` in the browser, or `global` on the server
    // add `density` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode
    this['density'] = density;
  }
  //global define:false
  if (typeof define === 'function' && define.amd) {
    define('density', [], function () {
      return density;
    });
  }
})();
