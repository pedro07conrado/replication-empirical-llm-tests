let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.fromLngLatArray', function(done) {
    let point = pkg.GeoPoint.fromLngLatArray([10, 20]);
    assert.strictEqual(point.lat, 20);
    assert.strictEqual(point.lng, 10);
    done();
  });
});
