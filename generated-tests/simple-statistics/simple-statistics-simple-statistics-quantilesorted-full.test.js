let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.quantileSorted', function(done) {
    try {
      // Test case 1: Single element array, p=0.5
      let result1 = pkg.quantileSorted([1], 0.5);
      assert.strictEqual(result1, 1);

      // Test case 2: Array with multiple elements, p=0.5
      let result2 = pkg.quantileSorted([1, 3, 5, 7], 0.5);
      assert.strictEqual(result2, 4);

      // Test case 3: Array with even number of elements, p=0.5
      let result3 = pkg.quantileSorted([1, 3, 5, 7, 9], 0.5);
      assert.strictEqual(result3, 5);

      // Test case 4: Array with odd number of elements, p=0.25
      let result4 = pkg.quantileSorted([1, 3, 5, 7, 9], 0.25);
      assert.strictEqual(result4, 2);

      // Test case 5: Array with even number of elements, p=0.75
      let result5 = pkg.quantileSorted([1, 3, 5, 7, 9], 0.75);
      assert.strictEqual(result5, 8);

      done();
    } catch (error) {
      done(error);
    }
  });
});
