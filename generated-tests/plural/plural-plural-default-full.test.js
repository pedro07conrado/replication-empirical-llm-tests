let mocha = require('mocha');
let assert = require('assert');
let plural = require('plural');

describe('test plural', function() {
  it('test plural.default', function(done) {
    // Test case: Single word, singular form
    assert.strictEqual(plural('cat'), 'cat', 'Single word should return singular form');

    // Test case: Single word, plural form
    assert.strictEqual(plural('dog'), 'dogs', 'Single word with number 2 should return plural form');

    // Test case: Multiple words, singular form
    assert.strictEqual(plural('apple'), 'apples', 'Multiple words should return plural form');

    // Test case: Single word, zero
    assert.strictEqual(plural('book', 0), 'books', 'Single word with number 0 should return plural form');

    // Test case: Single word, negative number
    assert.strictEqual(plural('car', -1), 'cars', 'Single word with negative number should return plural form');

    done();
  });
});
