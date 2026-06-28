let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.getAllCountries', function(done) {
    // Test with default options
    let result = pkg.getAllCountries();
    assert.ok(Array.isArray(result), 'Result should be an array');
    assert.strictEqual(Object.keys(result).length, Object.keys(data_default.countries).length, 'Number of keys in result should match the number of countries');

    // Test with specific country ID
    let countryId = 'US';
    let countryResult = pkg.getAllCountries({ id: countryId });
    assert.ok(Array.isArray(countryResult), 'Country result should be an array');
    assert.strictEqual(Object.keys(countryResult).length, 1, 'Number of keys in country result should match the number of countries with the specified ID');

    // Test with non-existent country ID
    let nonExistentCountryId = 'ZZ';
    let nonExistentCountryResult = pkg.getAllCountries({ id: nonExistentCountryId });
    assert.ok(Array.isArray(nonExistentCountryResult), 'Non-existent country result should be an array');
    assert.strictEqual(Object.keys(nonExistentCountryResult).length, 0, 'Number of keys in non-existent country result should be zero');

    // Test with options object
    let options = { includeTimezones: true };
    let optionsResult = pkg.getAllCountries(options);
    assert.ok(Array.isArray(optionsResult), 'Options result should be an array');
    assert.strictEqual(Object.keys(optionsResult).length, Object.keys(data_default.countries).length, 'Number of keys in options result should match the number of countries');

    done();
  });
});
