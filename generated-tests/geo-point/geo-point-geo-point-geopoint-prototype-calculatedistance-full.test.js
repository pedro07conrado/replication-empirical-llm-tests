let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.prototype.calculateDistance', function(done) {
    let point1 = new pkg.GeoPoint(34.0522, -118.2437); // Los Angeles
    let point2 = new pkg.GeoPoint(40.7128, -74.0060); // New York

    assert.strictEqual(point1.calculateDistance(point2), 3945.05);
    done();
  });
});
