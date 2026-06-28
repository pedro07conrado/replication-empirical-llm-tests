let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.calculateDistance', function(done) {
    const point1 = { latitude: 34.0522, longitude: -118.2437 };
    const point2 = { latitude: 40.7128, longitude: -74.0060 };

    const distance = pkg.GeoPoint.calculateDistance(point1, point2);

    assert.strictEqual(distance > 0 && distance < 5000, true);
    done();
  });
});
