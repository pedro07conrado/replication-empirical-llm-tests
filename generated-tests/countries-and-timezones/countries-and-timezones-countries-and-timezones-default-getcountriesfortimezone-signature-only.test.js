let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountriesForTimezone', function(done) {
    // Test with a valid timezone name
    let tzName = 'America/New_York';
    let result = pkg.default.getCountriesForTimezone(tzName);
    assert.isArray(result, 'Expected an array');
    assert.notEqual(result.length, 0, 'Array should not be empty');

    // Test with an invalid timezone name
    let invalidTzName = 'Invalid/TimeZone';
    try {
      pkg.default.getCountriesForTimezone(invalidTzName);
      assert.fail('Expected an error for invalid timezone');
    } catch (e) {
      assert.equal(e.message, `Unknown timezone: ${invalidTzName}`, 'Correct error message');
    }

    // Test with a valid timezone name and options
    let options = { includeHistorical: true };
    result = pkg.default.getCountriesForTimezone(tzName, options);
    assert.isArray(result, 'Expected an array');
    assert.notEqual(result.length, 0, 'Array should not be empty');

    done();
  });
});
