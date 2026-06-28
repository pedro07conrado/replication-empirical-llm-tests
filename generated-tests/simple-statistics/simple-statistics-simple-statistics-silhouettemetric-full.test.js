let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.silhouetteMetric', function(done) {
    let points = [[1, 2], [3, 4], [5, 6]];
    let labels = [0, 1, 0];
    let expected = 0.78;
    assert.strictEqual(pkg.silhouetteMetric(points, labels), expected);
    done();
  });
});
