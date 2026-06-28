let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getAllTimezones', function(done) {
    // Test the default behavior of getAllTimezones
    const expectedTimezones = Object.keys(pkg.data_default.timezones);
    assert.deepEqual(pkg.default.getAllTimezones(), expectedTimezones);

    // Test with an empty options object
    assert.deepEqual(pkg.default.getAllTimezones({}), expectedTimezones);

    // Test with a non-empty options object (not applicable as getAllTimezones does not use options)
    const customOptions = { someKey: 'someValue' };
    assert.deepEqual(pkg.default.getAllTimezones(customOptions), expectedTimezones);

    done();
  });
});
