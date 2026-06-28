let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.BayesianClassifier.prototype.train', function(done) {
    let classifier = new pkg.BayesianClassifier();
    classifier.train({ 'feature1': 'value1' }, 'category1');
    assert.strictEqual(classifier.data.category1['feature1']['value1'], 1);
    assert.strictEqual(classifier.totalCount, 1);

    classifier.train({ 'feature2': 'value2' }, 'category1');
    assert.strictEqual(classifier.data.category1['feature2']['value2'], 1);
    assert.strictEqual(classifier.totalCount, 2);

    classifier.train({ 'feature1': 'value1', 'feature2': 'value2' }, 'category1');
    assert.strictEqual(classifier.data.category1['feature1']['value1'], 2);
    assert.strictEqual(classifier.data.category1['feature2']['value2'], 2);
    assert.strictEqual(classifier.totalCount, 3);

    done();
  });
});
