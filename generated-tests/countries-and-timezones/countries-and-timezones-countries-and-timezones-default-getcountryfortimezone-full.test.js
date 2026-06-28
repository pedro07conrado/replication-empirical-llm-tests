let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountryForTimezone', function(done) {
    // Test case: get country for a known timezone
    let result1 = pkg.default.getCountryForTimezone('America/New_York');
    assert.strictEqual(result1, 'US');

    // Test case: get country for an unknown timezone
    let result2 = pkg.default.getCountryForTimezone('Europe/London');
    assert.strictEqual(result2, null);

    // Test case: handle options parameter
    let result3 = pkg.default.getCountryForTimezone('America/New_York', { strict: true });
    assert.strictEqual(result3, 'US');

    // Test case: handle invalid timezone name
    let result4 = pkg.default.getCountryForTimezone('Invalid/TimeZone');
    assert.strictEqual(result4, null);

    // Test case: handle no options provided
    let result5 = pkg.default.getCountryForTimezone('America/New_York');
    assert.strictEqual(result5, 'US');

    done();
  });
});
