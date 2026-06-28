let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getCountriesForTimezone', function(done) {
    const timezoneName = 'Europe/London';
    const result = pkg.default.getCountriesForTimezone(timezoneName);

    assert.ok(Array.isArray(result), 'Result should be an array');
    assert.strictEqual(result.length, 1, 'Result array should contain exactly one country for Europe/London');
    assert.strictEqual(result[0].id, 'GB', 'The country ID should be GB');
    assert.strictEqual(result[0].name, 'United Kingdom', 'The country name should be United Kingdom');
    assert.ok(Array.isArray(result[0].timezones), 'The country timezones property should be an array');
    assert.ok(result[0].timezones.includes(timezoneName), `The country timezones should include ${timezoneName}`);

    done();
  });
});