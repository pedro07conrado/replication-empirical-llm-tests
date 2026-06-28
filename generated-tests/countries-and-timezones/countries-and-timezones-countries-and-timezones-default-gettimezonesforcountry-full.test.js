let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getTimezonesForCountry', function(done) {
    // Test with a valid country ID and default options
    let result1 = pkg.default.getTimezonesForCountry('US');
    assert.strictEqual(result1.length, 4, 'Expected 4 timezones for the US');

    // Test with an invalid country ID
    let result2 = pkg.default.getTimezonesForCountry('INVALID');
    assert.strictEqual(result2, null, 'Expected null for an invalid country ID');

    // Test with a valid country ID and options
    let result3 = pkg.default.getTimezonesForCountry('US', { includeHistorical: true });
    assert.strictEqual(result3.length > 4, true, 'Expected more than 4 timezones for the US with historical data');

    // Test with an empty string as country ID
    let result4 = pkg.default.getTimezonesForCountry('');
    assert.strictEqual(result4, null, 'Expected null for an empty string country ID');

    // Test with a valid country ID and options including historical data
    let result5 = pkg.default.getTimezonesForCountry('US', { includeHistorical: true });
    assert.strictEqual(result5.length > 4, true, 'Expected more than 4 timezones for the US with historical data');

    done();
  });
});
