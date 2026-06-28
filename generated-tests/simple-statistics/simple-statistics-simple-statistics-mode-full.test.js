let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.mode', function(done) {
    let data1 = [3, 5, 2, 3, 4, 3];
    let expected1 = 3;
    assert.strictEqual(pkg.mode(data1), expected1);

    let data2 = [10, 20, 20, 30, 40, 40, 40];
    let expected2 = 40;
    assert.strictEqual(pkg.mode(data2), expected2);

    let data3 = [5, 5, 5, 5, 5];
    let expected3 = 5;
    assert.strictEqual(pkg.mode(data3), expected3);

    let data4 = [1, 2, 3, 4, 5];
    let expected4 = null;
    assert.strictEqual(pkg.mode(data4), expected4);

    let data5 = [];
    let expected5 = null;
    assert.strictEqual(pkg.mode(data5), expected5);

    done();
  });
});
