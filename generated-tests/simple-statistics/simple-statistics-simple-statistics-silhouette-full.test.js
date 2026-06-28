let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.silhouette', function(done) {
    const points = [
      [1, 2],
      [3, 4],
      [5, 6]
    ];
    const labels = [0, 1, 0];
    
    try {
      const result = pkg.silhouette(points, labels);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0], -0.2857142857142857);
      assert.strictEqual(result[1], 0.6666666666666666);
      assert.strictEqual(result[2], -0.2857142857142857);
    } catch (error) {
      done(error);
    }
    
    done();
  });
});
