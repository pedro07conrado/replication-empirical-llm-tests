let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getTimezone', function(done) {
    // Test with a valid country name
    let timezone = pkg.default.getTimezone('United States');
    assert.strictEqual(timezone, null, 'Expected null for invalid country name');

    // Test with an existing country name
    timezone = pkg.default.getTimezone('Canada');
    assert.ok(timezone, 'Expected non-null object for valid country name');
    assert.strictEqual(timezone.name, 'Canada', 'Expected correct country name');
    assert.strictEqual(timezone.utcOffset, -5 * 60, 'Expected correct UTC offset');

    // Test with a non-existent country name
    timezone = pkg.default.getTimezone('NonexistentCountry');
    assert.strictEqual(timezone, null, 'Expected null for invalid country name');

    done();
  });
});
