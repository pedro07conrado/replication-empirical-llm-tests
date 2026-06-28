let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.min', function(done) {
    try {
      let result = pkg.min([3, 1, 4, 1, 5]);
      assert.strictEqual(result, 1);
    } catch (error) {
      assert.fail(error.message);
    }

    try {
      let result = pkg.min([-2, -7, -3, -8]);
      assert.strictEqual(result, -8);
    } catch (error) {
      assert.fail(error.message);
    }

    try {
      let result = pkg.min([10.5, 9.2, 11.3, 8.4]);
      assert.strictEqual(result, 8.4);
    } catch (error) {
      assert.fail(error.message);
    }

    try {
      let result = pkg.min([7]);
      assert.strictEqual(result, 7);
    } catch (error) {
      assert.fail(error.message);
    }

    done();
  });
});
