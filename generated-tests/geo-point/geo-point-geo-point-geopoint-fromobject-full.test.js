let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.fromObject', function(done) {
    let point = pkg.GeoPoint.fromObject({ latitude: 40.7128, longitude: -74.0060 });
    assert.strictEqual(point.latitude, 40.7128);
    assert.strictEqual(point.longitude, -74.0060);
    done();
  });
});
