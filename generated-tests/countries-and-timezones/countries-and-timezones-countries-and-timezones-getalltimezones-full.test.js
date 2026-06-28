let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.getAllTimezones', function(done) {
    // Test with default options
    let timezones = pkg.getAllTimezones();
    assert(Array.isArray(timezones), 'getAllTimezones should return an array');
    assert(timezones.length > 0, 'The returned array should not be empty');

    // Test with specific options
    let filteredTimezones = pkg.getAllTimezones({ country: 'US' });
    assert(filteredTimezones.length > 0, 'Filtered timezones should not be empty');
    assert(filteredTimezones.every(timezone => timezone.country === 'US'), 'All filtered timezones should have the correct country');

    // Test with invalid options
    let invalidOptions = pkg.getAllTimezones({ invalidOption: true });
    assert(Array.isArray(invalidOptions), 'getAllTimezones should return an array');
    assert(invalidOptions.length > 0, 'The returned array should not be empty');

    done();
  });
});
