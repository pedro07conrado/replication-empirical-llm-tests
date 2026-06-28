let mocha = require('mocha');
let assert = require('assert');
let pkg = require('countries-and-timezones');

describe('test countries-and-timezones', function() {
  it('test countries-and-timezones.default.getAllTimezones', function(done) {
    let timezones = pkg.default.getAllTimezones();

    assert.strictEqual(typeof timezones, 'object', 'Result should be an object');
    assert.ok(timezones !== null, 'Result should not be null');
    assert.ok(Object.keys(timezones).length > 0, 'Result object should not be empty');
    assert.ok(timezones['America/New_York'], 'Should contain a known timezone like America/New_York');
    assert.strictEqual(timezones['America/New_York'].name, 'America/New_York', 'Name should match key for America/New_York');
    assert.strictEqual(typeof timezones['America/New_York'].utcOffset, 'number', 'utcOffset should be a number');

    done();
  });
});