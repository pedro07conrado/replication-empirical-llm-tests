let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sumNthPowerDeviations', function(done) {
    // Test case with n=2 (squared deviations)
    let data1 = [1, 2, 3, 4];
    let result1 = pkg.sumNthPowerDeviations(data1, 2);
    assert.strictEqual(result1, 10);

    // Test case with n=3 (cubed deviations)
    let data2 = [1, 2, 3, 4];
    let result2 = pkg.sumNthPowerDeviations(data2, 3);
    assert.strictEqual(result2, 56);

    // Test case with n=0 (sum of deviations from mean)
    let data3 = [1, 2, 3, 4];
    let result3 = pkg.sumNthPowerDeviations(data3, 0);
    assert.strictEqual(result3, 0);

    // Test case with a single element
    let data4 = [5];
    let result4 = pkg.sumNthPowerDeviations(data4, 2);
    assert.strictEqual(result4, 0);

    // Test case with negative numbers
    let data5 = [-1, -2, -3, -4];
    let result5 = pkg.sumNthPowerDeviations(data5, 2);
    assert.strictEqual(result5, 10);

    done();
  });
});
