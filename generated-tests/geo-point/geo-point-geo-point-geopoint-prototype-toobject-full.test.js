let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.prototype.toObject', function(done) {
    let point = new pkg.GeoPoint(34.0522, -118.2437);
    let expected = { latitude: 34.0522, longitude: -118.2437 };
    assert.deepStrictEqual(point.toObject(), expected);
    done();
  });
});
