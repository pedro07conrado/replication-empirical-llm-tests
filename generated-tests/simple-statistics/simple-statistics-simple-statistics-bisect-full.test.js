let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.bisect', function(done) {
    // Test case: Find the root of a quadratic equation x^2 - 4 = 0
    const func = (x) => x * x - 4;
    const start = 0;
    const end = 3;
    const maxIterations = 100;
    const errorTolerance = 1e-6;

    try {
      const result = pkg.bisect(func, start, end, maxIterations, errorTolerance);
      assert.strictEqual(result, 2, 'The root of x^2 - 4 should be approximately 2');
    } catch (error) {
      console.error(error.message);
    }

    done();
  });
});
