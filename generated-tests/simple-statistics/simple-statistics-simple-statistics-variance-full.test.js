let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.variance', function(done) {
    let data = [1, 2, 3, 4];
    let expected = 1.25;
    assert.strictEqual(pkg.variance(data), expected);
    done();
  });
});
