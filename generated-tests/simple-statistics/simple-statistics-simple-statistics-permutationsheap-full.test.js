let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.permutationsHeap', function(done) {
    const elements = [1, 2, 3];
    const expectedOutput = [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ];

    const result = pkg.permutationsHeap(elements);

    assert.deepStrictEqual(result, expectedOutput);
    done();
  });
});
