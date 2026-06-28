let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountriesForTimezone', function(done) {
    // Test with a known timezone and default options
    let tzName = 'America/New_York';
    let expectedCountries = ['US'];
    assert.deepEqual(pkg.default.getCountriesForTimezone(tzName), expectedCountries);

    // Test with a different timezone and default options
    tzName = 'Europe/London';
    expectedCountries = ['GB'];
    assert.deepEqual(pkg.default.getCountriesForTimezone(tzName), expectedCountries);

    // Test with a known timezone and custom options
    let options = { includeHistorical: true };
    tzName = 'America/New_York';
    expectedCountries = ['US', 'CA']; // Assuming CA is also in the list for this example
    assert.deepEqual(pkg.default.getCountriesForTimezone(tzName, options), expectedCountries);

    done();
  });
});
