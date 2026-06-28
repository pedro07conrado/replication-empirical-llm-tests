let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.addToMean', function(done) {
    let mean = 5;
    let n = 3;
    let newValue = 7;

    let result = pkg.addToMean(mean, n, newValue);

    assert.strictEqual(result, 6.0, 'The new mean should be calculated correctly');
    done();
  });
});
