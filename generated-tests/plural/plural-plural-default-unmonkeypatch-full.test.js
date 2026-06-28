let mocha = require('mocha');
let assert = require('assert');
let pkg = require('plural');

describe('test plural', function() {
  it('test plural.default.unmonkeyPatch', function(done) {
    // Before patching, check if the plural method exists on String.prototype
    let originalPluralMethod = String.prototype.plural;
    assert.strictEqual(originalPluralMethod, null);

    // Call the unmonkeyPatch function to remove the plural method from String.prototype
    pkg.default.unmonkeyPatch();

    // After patching, check if the plural method has been removed
    assert.strictEqual(String.prototype.plural, null);

    done();
  });
});
