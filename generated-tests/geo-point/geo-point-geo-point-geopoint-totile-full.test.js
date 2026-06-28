let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.toTile', function(done) {
    const coordinate = { longitude: -122.4194, latitude: 37.7749 };
    const zoom = 10;
    const expected = { x: 568, y: 384 };
    assert.deepStrictEqual(pkg.GeoPoint.toTile(coordinate, zoom), expected);
    done();
  });
});
