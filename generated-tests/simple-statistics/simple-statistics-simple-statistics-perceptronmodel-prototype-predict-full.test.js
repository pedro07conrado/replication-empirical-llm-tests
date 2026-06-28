let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.PerceptronModel.prototype.predict', function(done) {
    let model = new pkg.PerceptronModel();
    model.weights = [1, -2];
    model.bias = 0;

    // Test with positive score
    assert.strictEqual(model.predict([3, 4]), 1);

    // Test with negative score
    assert.strictEqual(model.predict([-1, -2]), 0);

    // Test with zero score
    assert.strictEqual(model.predict([0, 0]), 0);

    // Test with different feature length
    assert.strictEqual(model.predict([1, 2, 3]), null);

    // Test with empty features array
    assert.strictEqual(model.predict([]), null);

    done();
  });
});
