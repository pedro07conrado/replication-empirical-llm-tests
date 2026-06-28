let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getAllTimezones', function(done) {
    // Test the getAllTimezones function with default options
    pkg.default.getAllTimezones().then(timezones => {
      assert.ok(Array.isArray(timezones), 'getAllTimezones should return an array');
      assert.notEqual(timezones.length, 0, 'The returned array should not be empty');
      done();
    }).catch(err => {
      console.error('Error fetching timezones:', err);
      done(new Error('Failed to fetch timezones'));
    });
  });
});
