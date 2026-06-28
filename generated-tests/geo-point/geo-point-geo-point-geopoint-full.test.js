let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint', function(done) {
    // Test creating a GeoPoint with valid latitude and longitude
    let point1 = new pkg.GeoPoint(40.7128, -74.0060);
    assert.strictEqual(point1.latitude, 40.7128);
    assert.strictEqual(point1.longitude, -74.0060);

    // Test creating a GeoPoint with invalid latitude
    try {
      let point2 = new pkg.GeoPoint(91, -74.0060);
      done(new Error('Expected RangeError for invalid latitude'));
    } catch (e) {
      assert.strictEqual(e.message, 'bad latitude value');
      done();
    }

    // Test creating a GeoPoint with invalid longitude
    try {
      let point3 = new pkg.GeoPoint(40.7128, 181);
      done(new Error('Expected RangeError for invalid longitude'));
    } catch (e) {
      assert.strictEqual(e.message, 'bad longitude value');
      done();
    }

    // Test creating a GeoPoint from an object
    let point4 = pkg.GeoPoint.fromObject({ latitude: 40.7128, longitude: -74.0060 });
    assert.strictEqual(point4.latitude, 40.7128);
    assert.strictEqual(point4.longitude, -74.0060);

    // Test creating a GeoPoint from a GeoJSON object
    let point5 = pkg.GeoPoint.fromGeoJSON({ type: 'Point', coordinates: [ -74.0060, 40.7128 ] });
    assert.strictEqual(point5.latitude, 40.7128);
    assert.strictEqual(point5.longitude, -74.0060);

    done();
  });
});
