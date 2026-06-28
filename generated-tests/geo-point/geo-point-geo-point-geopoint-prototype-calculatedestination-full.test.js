let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.prototype.calculateDestination', function(done) {
    const point1 = new pkg.GeoPoint(34.0522, -118.2437); // Los Angeles
    const point2 = new pkg.GeoPoint(40.7128, -74.0060); // New York

    const distance = 3940; // Distance in kilometers
    const bearing = 45; // Bearing in degrees

    const destination = point1.calculateDestination(distance, bearing);

    assert.strictEqual(destination.latitude, 40.7128, 'Latitude is incorrect');
    assert.strictEqual(destination.longitude, -74.0060, 'Longitude is incorrect');

    done();
  });
});
