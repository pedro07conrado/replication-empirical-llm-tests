let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.shuffleInPlace', function(done) {
    let array = [1, 2, 3, 4, 5];
    let randomSource = Math.random;
    pkg.shuffleInPlace(array, randomSource);
    assert.ok(array.length === 5, 'Array length should remain unchanged');
    for (let i = 0; i < array.length; i++) {
      assert.ok(array[i] >= 1 && array[i] <= 5, 'All elements should be between 1 and 5');
    }
    done();
  });
});
