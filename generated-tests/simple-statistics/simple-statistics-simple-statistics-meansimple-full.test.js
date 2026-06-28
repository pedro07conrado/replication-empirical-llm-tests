let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.meanSimple', function(done) {
    try {
      let result1 = pkg.meanSimple([1, 2, 3, 4, 5]);
      assert.strictEqual(result1, 3);

      let result2 = pkg.meanSimple([10, 20, 30, 40, 50]);
      assert.strictEqual(result2, 30);

      let result3 = pkg.meanSimple([-5, -10, -15, -20, -25]);
      assert.strictEqual(result3, -15);

      let result4 = pkg.meanSimple([0, 0, 0, 0, 0]);
      assert.strictEqual(result4, 0);

      done();
    } catch (error) {
      done(error);
    }
  });
});
