let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.mean', function(done) {
    try {
      let result1 = pkg.mean([1, 2, 3, 4, 5]);
      assert.strictEqual(result1, 3);

      let result2 = pkg.mean([10, 20, 30, 40, 50]);
      assert.strictEqual(result2, 30);

      let result3 = pkg.mean([]);
      assert.throws(() => pkg.mean([]), /mean requires at least one data point/);

      let result4 = pkg.mean([1.5, 2.5, 3.5]);
      assert.strictEqual(result4, 2.5);

      done();
    } catch (error) {
      done(error);
    }
  });
});
