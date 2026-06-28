let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.ckmeans', function(done) {
    const data = [1, 2, 3, 4, 5];
    const clusters = pkg.ckmeans(data, 2);
    assert.strictEqual(clusters.length, 2);
    assert.ok(clusters[0].every(x => x <= 3));
    assert.ok(clusters[1].every(x => x >= 4));
    done();
  });
});
