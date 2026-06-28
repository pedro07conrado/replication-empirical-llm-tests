let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleCorrelation', function(done) {
    // Test with two sets of data where the correlation is expected to be 1
    let x = [1, 2, 3, 4, 5];
    let y = [1, 2, 3, 4, 5];
    assert.strictEqual(pkg.sampleCorrelation(x, y), 1);

    // Test with two sets of data where the correlation is expected to be -1
    x = [1, 2, 3, 4, 5];
    y = [5, 4, 3, 2, 1];
    assert.strictEqual(pkg.sampleCorrelation(x, y), -1);

    // Test with two sets of data where the correlation is expected to be close to 0
    x = [1, 2, 3, 4, 5];
    y = [6, 7, 8, 9, 10];
    assert.strictEqual(pkg.sampleCorrelation(x, y), 0);

    // Test with two sets of data where the correlation is expected to be close to 0.5
    x = [1, 2, 3, 4, 5];
    y = [2, 3, 4, 5, 6];
    assert.strictEqual(pkg.sampleCorrelation(x, y), 0.5);

    // Test with two sets of data where the correlation is expected to be close to -0.5
    x = [1, 2, 3, 4, 5];
    y = [6, 5, 4, 3, 2];
    assert.strictEqual(pkg.sampleCorrelation(x, y), -0.5);

    done();
  });
});
