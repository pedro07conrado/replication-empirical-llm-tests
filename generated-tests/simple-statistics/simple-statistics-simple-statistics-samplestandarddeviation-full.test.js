let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleStandardDeviation', function(done) {
    let data = [1, 2, 3, 4, 5];
    let expected = Math.sqrt(2);
    assert.strictEqual(pkg.sampleStandardDeviation(data), expected, 'Test failed: sampleStandardDeviation should return the correct standard deviation');
    done();
  });
});
