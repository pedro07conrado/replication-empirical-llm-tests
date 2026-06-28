let mocha = require('mocha');
let assert = require('assert');
let pkg = require('plural');

describe('test plural', function() {
  it('test plural.addRule', function(done) {
    // Test adding a rule to the pluralization rules
    let originalRules = pkg.rules.slice(); // Save the original rules

    // Add a new rule
    pkg.addRule(/(apple|orange)/, 'fruit');

    // Check if the rule was added correctly
    assert.strictEqual(pkg.rules.length, originalRules.length + 1);
    assert.deepStrictEqual(pkg.rules[pkg.rules.length - 1], [/apple|orange/, 'fruit']);

    // Restore the original rules
    pkg.rules = originalRules;

    done();
  });
});
