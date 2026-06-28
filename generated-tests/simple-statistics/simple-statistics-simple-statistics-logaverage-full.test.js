let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.logAverage', function(done) {
    try {
      let result = pkg.logAverage([1, 2, 3]);
      assert.strictEqual(result, Math.exp((Math.log(1) + Math.log(2) + Math.log(3)) / 3), 'logAverage should return the correct log average');
      done();
    } catch (error) {
      done(error);
    }
  });
});
