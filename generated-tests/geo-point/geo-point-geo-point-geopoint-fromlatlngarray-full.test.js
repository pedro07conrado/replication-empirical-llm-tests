let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.fromLatLngArray', function(done) {
    let point = pkg.GeoPoint.fromLatLngArray([40.7128, -74.0060]);
    assert.strictEqual(point.lat, 40.7128);
    assert.strictEqual(point.lng, -74.0060);
    done();
  });
});
