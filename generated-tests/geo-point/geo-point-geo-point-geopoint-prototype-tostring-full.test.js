let mocha = require('mocha');
let assert = require('assert');
let pkg = require('geo-point');

describe('test geo-point', function() {
  it('test geo-point.GeoPoint.prototype.toString', function(done) {
    let point = new pkg.GeoPoint(34.0522, -118.2437);
    assert.strictEqual(point.toString(), '34.0522,-118.2437');
    done();
  });
});
