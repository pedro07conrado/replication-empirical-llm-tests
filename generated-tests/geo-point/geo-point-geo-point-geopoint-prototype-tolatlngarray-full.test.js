let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.prototype.toLatLngArray', function(done) {
    let point = new pkg.GeoPoint(40.7128, -74.0060);
    assert.deepEqual(point.toLatLngArray(), [40.7128, -74.0060], 'toLatLngArray should return the correct latitude and longitude');
    done();
  });
});
