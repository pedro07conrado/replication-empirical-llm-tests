let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.linearRegression', function(done) {
    // Test with a single point
    let data1 = [[1, 2]];
    let result1 = pkg.linearRegression(data1);
    assert.strictEqual(result1.m, 0, 'Slope should be 0 for a single point');
    assert.strictEqual(result1.b, 2, 'Y-intercept should be 2 for a single point');

    // Test with two points
    let data2 = [[1, 2], [3, 4]];
    let result2 = pkg.linearRegression(data2);
    assert.strictEqual(result2.m, 1, 'Slope should be 1');
    assert.strictEqual(result2.b, 0, 'Y-intercept should be 0');

    // Test with more points
    let data3 = [[0, 0], [1, 1], [2, 4]];
    let result3 = pkg.linearRegression(data3);
    assert.strictEqual(result3.m, 2, 'Slope should be 2');
    assert.strictEqual(result3.b, -1, 'Y-intercept should be -1');

    done();
  });
});
