let mocha = require('mocha');
let assert = require('assert');
let pkg = require('plural');

describe('test plural', function() {
  it('test plural.default.monkeyPatch', function(done) {
    try {
      String.prototype.plural = function(num) {
        return plural(this, num)
      }
    } catch (e) {
      assert.fail('Expected to add plural function to String object');
    }

    let testString = 'monkey';
    let result = testString.plural(2);
    assert.strictEqual(result, 'monkeys', 'Expected "monkeys" for 2 monkeys');

    done();
  });
});
