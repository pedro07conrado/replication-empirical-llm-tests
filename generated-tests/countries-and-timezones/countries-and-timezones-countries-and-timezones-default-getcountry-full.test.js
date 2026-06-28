let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountry', function(done) {
    // Test with a valid country ID
    let id = 'US';
    let options = {};
    assert.strictEqual(pkg.default.getCountry(id, options), 'United States');

    // Test with an invalid country ID
    id = 'INVALID_ID';
    assert.strictEqual(pkg.default.getCountry(id, options), null);

    // Test with a valid country ID and options
    id = 'DE';
    options = { format: 'alpha-2' };
    assert.strictEqual(pkg.default.getCountry(id, options), 'DE');

    // Test with an invalid option key
    id = 'FR';
    options = { invalidKey: 'value' };
    assert.strictEqual(pkg.default.getCountry(id, options), null);

    // Test with a valid country ID and no options
    id = 'GB';
    assert.strictEqual(pkg.default.getCountry(id), 'United Kingdom');

    done();
  });
});
