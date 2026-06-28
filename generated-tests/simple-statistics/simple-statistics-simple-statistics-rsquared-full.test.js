let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.rSquared', function(done) {
    // Test case with a simple linear relationship
    var x = [[1, 2], [2, 4], [3, 6]];
    var func = function(x) { return 2 * x; };
    assert.strictEqual(pkg.rSquared(x, func), 1);

    // Test case with no variation in data points
    var y = [[1, 1], [2, 1], [3, 1]];
    var func = function(x) { return 1; };
    assert.strictEqual(pkg.rSquared(y, func), 0);

    // Test case with a perfect fit
    var z = [[1, 1], [2, 2], [3, 3]];
    var func = function(x) { return x; };
    assert.strictEqual(pkg.rSquared(z, func), 1);

    // Test case with a random linear relationship
    var w = [[1, 2], [2, 4], [3, 6], [4, 8]];
    var func = function(x) { return 2 * x; };
    assert.ok(Math.abs(pkg.rSquared(w, func) - 0.95) < 0.01);

    done();
  });
});
