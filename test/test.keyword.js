//Prepare test
require('./../density');
var assert = require('assert');

describe('density', function () {
  it('should split the keywords', function (done) {
    assert.equal(JSON.stringify(density("Hello World").getDensity()), JSON.stringify(
    [{
        word: "world",
        count: 1
     },
     {
        word: "hello",
        count: 1
     }
    ]));
    done();
  });
  it('should count the keywords', function (done) {
    assert.equal(JSON.stringify(density("Hello Hello all").getDensity()), JSON.stringify(
    [{
        word: "hello",
        count: 2
     },
     {
        word: "all",
        count: 1
     }
    ]));
    done();
  });
  it('should split the keywords by up to 3-word phrases', function (done) {
    assert.equal(JSON.stringify(density("Hello World program is usually simple Hello World program to display an example.").setOptions({maxWordsInKeyword: 3, removePunctuation: true}).getDensity()), JSON.stringify(
    [
        {
            "word": "world program",
            "count": 2
        },
        {
            "word": "world",
            "count": 2
        },
        {
            "word": "program",
            "count": 2
        },
        {
            "word": "hello world program",
            "count": 2
        },
        {
            "word": "hello world",
            "count": 2
        },
        {
            "word": "hello",
            "count": 2
        },
        {
            "word": "program usually simple",
            "count": 1
        },
        {
            "word": "to display an",
            "count": 1
        },
        {
            "word": "to display",
            "count": 1
        },
        {
            "word": "simple hello world",
            "count": 1
        },
        {
            "word": "simple hello",
            "count": 1
        },
        {
            "word": "simple",
            "count": 1
        },
        {
            "word": "world program to",
            "count": 1
        },
        {
            "word": "program usually",
            "count": 1
        },
        {
            "word": "program to display",
            "count": 1
        },
        {
            "word": "program to",
            "count": 1
        },
        {
            "word": "world program usually",
            "count": 1
        },
        {
            "word": "usually simple hello",
            "count": 1
        },
        {
            "word": "usually simple",
            "count": 1
        },
        {
            "word": "usually",
            "count": 1
        },
        {
            "word": "example",
            "count": 1
        },
        {
            "word": "display an example",
            "count": 1
        },
        {
            "word": "display an",
            "count": 1
        },
        {
            "word": "display",
            "count": 1
        },
        {
            "word": "an example",
            "count": 1
        }
    ]));
    done();
  });
});
