let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.getCountry', function(done) {
    // Test with a valid country ID
    let result1 = pkg.getCountry('US');
    assert.strictEqual(result1.id, 'US', 'The returned country ID should be "US"');

    // Test with an invalid country ID
    let result2 = pkg.getCountry('INVALID_ID');
    assert.strictEqual(result2, undefined, 'The returned value for an invalid ID should be undefined');

    // Test with a country ID that has multiple entries
    let result3 = pkg.getCountry('US-DC');
    assert.strictEqual(result3.id, 'US-DC', 'The returned country ID should be "US-DC"');

    // Test with options parameter
    let result4 = pkg.getCountry('US', { format: 'json' });
    assert.strictEqual(typeof result4, 'object', 'The returned value should be an object when using options');

    // Test with a non-object options parameter
    let result5 = pkg.getCountry('US', 123);
    assert.strictEqual(result5, undefined, 'The returned value for a non-object options parameter should be undefined');

    done();
  });
});
