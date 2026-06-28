let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.wilcoxonRankSum', function(done) {
    try {
      let result = pkg.wilcoxonRankSum([1, 2, 3], [4, 5, 6]);
      assert.strictEqual(result, 9);
    } catch (e) {
      done(e);
    }
    done();
  });
});
