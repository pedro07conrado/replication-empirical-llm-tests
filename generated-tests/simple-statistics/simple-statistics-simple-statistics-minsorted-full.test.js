let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.minSorted', function(done) {
    let data = [5, 3, 8, 1, 2];
    let result = pkg.minSorted(data);
    assert.strictEqual(result, 1, 'The minimum value in the sorted array should be 1');
    
    data = [10, 9, 8, 7, 6];
    result = pkg.minSorted(data);
    assert.strictEqual(result, 6, 'The minimum value in the sorted array should be 6');
    
    data = [-2, -5, -3, -8, -1];
    result = pkg.minSorted(data);
    assert.strictEqual(result, -8, 'The minimum value in the sorted array should be -8');
    
    data = [0, 0, 0, 0, 0];
    result = pkg.minSorted(data);
    assert.strictEqual(result, 0, 'The minimum value in the array with all zeros should be 0');
    
    done();
  });
});
