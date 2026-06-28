let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.BayesianClassifier.prototype.score', function(done) {
    // Create a new BayesianClassifier instance
    let classifier = new pkg.BayesianClassifier();

    // Train the classifier with some data
    classifier.train({ apple: 'red' }, 'fruit');
    classifier.train({ banana: 'yellow' }, 'fruit');
    classifier.train({ apple: 'green' }, 'fruit');

    // Test the score function with a sample item
    let result = classifier.score({ apple: 'green' });

    // Expected output is an object with one category and its sum of odds
    assert.strictEqual(Object.keys(result).length, 1);
    assert.strictEqual(result.fruit, 2 / 3);

    done();
  });
});
