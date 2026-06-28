let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.BayesianClassifier', function(done) {
    let classifier = new pkg.BayesianClassifier();
    assert.strictEqual(classifier.totalCount, 0);
    assert.deepEqual(classifier.data, {});
    done();
  });
});
