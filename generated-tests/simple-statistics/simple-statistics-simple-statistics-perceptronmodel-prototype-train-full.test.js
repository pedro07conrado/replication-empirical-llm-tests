let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.PerceptronModel.prototype.train', function(done) {
    let model = new pkg.PerceptronModel();
    
    // Test with a single feature and label
    assert.strictEqual(model.train([1], 0), model);
    assert.deepEqual(model.weights, [1]);
    assert.strictEqual(model.bias, 1);

    // Test with multiple features and labels
    assert.strictEqual(model.train([1, 2], 1), model);
    assert.deepEqual(model.weights, [1, 2]);
    assert.strictEqual(model.bias, 3);

    // Test with a different label
    assert.strictEqual(model.train([1, 2], 0), model);
    assert.deepEqual(model.weights, [-1.5, -1.5]);
    assert.strictEqual(model.bias, 1);

    // Test with a new feature shape
    assert.strictEqual(model.train([3, 4], 1), model);
    assert.deepEqual(model.weights, [2.5, 3.5]);
    assert.strictEqual(model.bias, 6);

    done();
  });
});
