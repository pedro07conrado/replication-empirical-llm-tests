let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountry', function(done) {
    // Test with a valid country ID
    let result1 = pkg.default.getCountry('US');
    assert.strictEqual(result1, 'United States of America', 'Expected "United States of America" for US');

    // Test with an invalid country ID
    let result2 = pkg.default.getCountry('INVALID');
    assert.strictEqual(result2, null, 'Expected null for INVALID');

    // Test with a valid ISO 3166-1 alpha-2 code
    let result3 = pkg.default.getCountry('CA');
    assert.strictEqual(result3, 'Canada', 'Expected "Canada" for CA');

    // Test with a valid ISO 3166-1 alpha-3 code
    let result4 = pkg.default.getCountry('CAN');
    assert.strictEqual(result4, 'Canada', 'Expected "Canada" for CAN');

    // Test with an empty string
    let result5 = pkg.default.getCountry('');
    assert.strictEqual(result5, null, 'Expected null for empty string');

    done();
  });
});
