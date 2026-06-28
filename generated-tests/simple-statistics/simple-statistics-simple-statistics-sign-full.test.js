let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sign', function(done) {
    // Test positive number
    assert.strictEqual(pkg.sign(5), 1, 'Positive number should return 1');

    // Test negative number
    assert.strictEqual(pkg.sign(-3), -1, 'Negative number should return -1');

    // Test zero
    assert.strictEqual(pkg.sign(0), 0, 'Zero should return 0');

    // Test non-numeric input
    try {
      pkg.sign('a');
      assert.fail('Expected TypeError for non-numeric input');
    } catch (e) {
      assert.strictEqual(e.message, 'not a number', 'Non-numeric input should throw TypeError');
    }

    done();
  });
});
