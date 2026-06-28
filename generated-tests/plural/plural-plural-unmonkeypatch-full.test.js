let mocha = require('mocha');
let assert = require('assert');
let pkg = require('plural');

describe('test plural', function() {
  it('test plural.unmonkeyPatch', function(done) {
    // Arrange
    let originalPlural = String.prototype.plural;

    // Act
    pkg.unmonkeyPatch();

    // Assert
    assert.strictEqual(String.prototype.plural, null);
    assert.strictEqual(Object.getOwnPropertyDescriptor(String.prototype, 'plural').configurable, true);
    assert.strictEqual(Object.getOwnPropertyDescriptor(String.prototype, 'plural').enumerable, false);
    assert.strictEqual(Object.getOwnPropertyDescriptor(String.prototype, 'plural').writable, true);

    // Clean up
    String.prototype.plural = originalPlural;

    done();
  });
});
