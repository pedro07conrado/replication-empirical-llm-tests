let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.interquartileRange', function(done) {
    let data = [1, 2, 3, 4, 5];
    let result = pkg.interquartileRange(data);
    assert.strictEqual(result, 2, 'The interquartile range should be 2');

    data = [10, 20, 30, 40, 50];
    result = pkg.interquartileRange(data);
    assert.strictEqual(result, 20, 'The interquartile range should be 20');

    data = [5, 7, 9, 11, 13];
    result = pkg.interquartileRange(data);
    assert.strictEqual(result, 4, 'The interquartile range should be 4');

    data = [1, 3, 5, 7, 9];
    result = pkg.interquartileRange(data);
    assert.strictEqual(result, 2, 'The interquartile range should be 2');

    done();
  });
});
