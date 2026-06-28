let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleRankCorrelation', function(done) {
    // Test case with two arrays of equal length
    let x = [3, 1, 4, 1, 5];
    let y = [2, 6, 5, 3, 5];
    assert.strictEqual(pkg.simple-statistics.sampleRankCorrelation(x, y), 0.8);

    // Test case with two arrays of different lengths
    let x2 = [1, 2, 3];
    let y2 = [4, 5];
    assert.strictEqual(pkg.simple-statistics.sampleRankCorrelation(x2, y2), -0.6);

    // Test case with one array being empty
    let x3 = [];
    let y3 = [1, 2, 3];
    assert.strictEqual(pkg.simple-statistics.sampleRankCorrelation(x3, y3), NaN);

    // Test case with both arrays being empty
    let x4 = [];
    let y4 = [];
    assert.strictEqual(pkg.simple-statistics.sampleRankCorrelation(x4, y4), NaN);

    // Test case with all elements in one array being the same
    let x5 = [1, 1, 1, 1];
    let y5 = [2, 3, 4, 5];
    assert.strictEqual(pkg.simple-statistics.sampleRankCorrelation(x5, y5), NaN);

    done();
  });
});
