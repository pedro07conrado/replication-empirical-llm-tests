let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.max', function(done) {
    try {
      let result1 = pkg.max([3, 5, 7, 2, 8]);
      assert.strictEqual(result1, 8);
      
      let result2 = pkg.max([-10, -20, -30, -40, -50]);
      assert.strictEqual(result2, -10);
      
      let result3 = pkg.max([1.5, 2.5, 3.5, 4.5, 5.5]);
      assert.strictEqual(result3, 5.5);
      
      let result4 = pkg.max([]);
      assert.strictEqual(result4, null); // Assuming max returns null for empty array
    } catch (error) {
      done(error);
    }
    
    done();
  });
});
