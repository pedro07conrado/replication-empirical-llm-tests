let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.prototype.adjustPrecision', function(done) {
    const originalGeoPoint = new pkg.GeoPoint(34.0522, -118.2437);
    const adjustedGeoPoint = originalGeoPoint.adjustPrecision(2);

    assert.strictEqual(adjustedGeoPoint.latitude.toFixed(2), '34.05');
    assert.strictEqual(adjustedGeoPoint.longitude.toFixed(2), '-118.24');

    done();
  });
});
