let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.harmonicMean', function(done) {
    try {
      let result = pkg.harmonicMean([2, 3, 4]);
      assert.strictEqual(result, 1.8333333333333333);
    } catch (error) {
      done(error);
    }

    try {
      let result = pkg.harmonicMean([5, 7, 9]);
      assert.strictEqual(result, 4.285714285714286);
    } catch (error) {
      done(error);
    }

    try {
      let result = pkg.harmonicMean([10, 20, 30]);
      assert.strictEqual(result, 15);
    } catch (error) {
      done(error);
    }

    try {
      let result = pkg.harmonicMean([1, 2, 3]);
      assert.strictEqual(result, 1.6363636363636365);
    } catch (error) {
      done(error);
    }

    try {
      let result = pkg.harmonicMean([0, 2, 4]);
      assert.ok(false); // This should throw an error
    } catch (error) {
      assert.strictEqual(error.message, "harmonicMean requires only positive numbers as input");
      done();
    }

    try {
      let result = pkg.harmonicMean([]);
      assert.ok(false); // This should throw an error
    } catch (error) {
      assert.strictEqual(error.message, "harmonicMean requires at least one data point");
      done();
    }
  });
});
