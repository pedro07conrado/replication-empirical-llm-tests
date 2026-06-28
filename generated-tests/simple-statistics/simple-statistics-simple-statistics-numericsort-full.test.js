let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.numericSort', function(done) {
    let inputArray = [3, 1, 4, 1, 5, 9];
    let expectedOutput = [1, 1, 3, 4, 5, 9];

    assert.deepEqual(pkg.numericSort(inputArray), expectedOutput);

    done();
  });
});
