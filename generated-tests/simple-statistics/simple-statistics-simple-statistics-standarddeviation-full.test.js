let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.standardDeviation', function(done) {
    let data1 = [1, 2, 3, 4, 5];
    let expected1 = Math.sqrt(2);
    assert.strictEqual(pkg.standardDeviation(data1), expected1);

    let data2 = [10, 10, 10, 10];
    let expected2 = 0;
    assert.strictEqual(pkg.standardDeviation(data2), expected2);

    let data3 = [-5, -1, 0, 4, 9];
    let expected3 = Math.sqrt(28);
    assert.strictEqual(pkg.standardDeviation(data3), expected3);

    let data4 = [1.5, 2.5, 3.5, 4.5, 5.5];
    let expected4 = 1;
    assert.strictEqual(pkg.standardDeviation(data4), expected4);

    done();
  });
});
