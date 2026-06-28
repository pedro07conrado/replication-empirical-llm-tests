let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountry', function(done) {
    let usCountry = pkg.default.getCountry('US');
    assert.strictEqual(typeof usCountry, 'object', 'Valid country should return an object');
    assert.strictEqual(usCountry.id, 'US', 'Country ID should match input for US');
    assert.strictEqual(usCountry.name, 'United States', 'Country name should be correct for US');
    assert.ok(Array.isArray(usCountry.timezones), 'Timezones should be an array for US');
    assert.ok(usCountry.timezones.length > 0, 'Timezones array should not be empty for US');

    let invalidCountry = pkg.default.getCountry('XX');
    assert.strictEqual(invalidCountry, undefined, 'Invalid country ID should return undefined');

    done();
  });
});