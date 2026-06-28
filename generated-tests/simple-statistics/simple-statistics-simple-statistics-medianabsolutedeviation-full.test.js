let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.medianAbsoluteDeviation', function(done) {
    let data = [1, 2, 3, 4, 5];
    let result = pkg.medianAbsoluteDeviation(data);
    assert.strictEqual(result, 1.0, 'The median absolute deviation should be 1.0');
    done();
  });
});
