let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.tTestTwoSample', function(done) {
    // Test case with two samples and a difference of zero
    let sampleX = [1, 2, 3];
    let sampleY = [4, 5, 6];
    let result = pkg.tTestTwoSample(sampleX, sampleY);
    assert.strictEqual(result, -1.9607843137254902);

    // Test case with two samples and a difference of one
    let sampleX = [1, 2, 3];
    let sampleY = [4, 5, 6];
    let result = pkg.tTestTwoSample(sampleX, sampleY, 1);
    assert.strictEqual(result, -1.9607843137254902);

    // Test case with one empty sample
    let sampleX = [1, 2, 3];
    let sampleY = [];
    let result = pkg.tTestTwoSample(sampleX, sampleY);
    assert.strictEqual(result, null);

    // Test case with two identical samples and a difference of zero
    let sampleX = [1, 2, 3];
    let sampleY = [1, 2, 3];
    let result = pkg.tTestTwoSample(sampleX, sampleY);
    assert.strictEqual(result, 0);

    // Test case with two identical samples and a difference of one
    let sampleX = [1, 2, 3];
    let sampleY = [1, 2, 3];
    let result = pkg.tTestTwoSample(sampleX, sampleY, 1);
    assert.strictEqual(result, 0);

    done();
  });
});
