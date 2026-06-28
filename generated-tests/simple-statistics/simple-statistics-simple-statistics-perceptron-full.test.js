let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.perceptron', function(done) {
    let model = new pkg.PerceptronModel();
    assert.strictEqual(model.weights.length, 0, 'Weights should be an empty array');
    assert.strictEqual(model.bias, 0, 'Bias should be zero');
    done();
  });
});
