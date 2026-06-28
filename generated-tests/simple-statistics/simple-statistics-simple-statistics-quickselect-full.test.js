let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.quickselect', function(done) {
    var arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    var k = 4;
    var result = pkg.quickselect(arr, k);
    assert.strictEqual(result, 3, 'The quickselect function should return the correct value');
    done();
  });
});
