let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.kernelDensityEstimation', function(done) {
    const X = [1, 2, 3, 4, 5];
    const kernelFn = kernels.gaussian;
    const bandwidthMethod = bandwidthMethods.nrd;

    const kde = kernelDensityEstimation(X, kernelFn, bandwidthMethod);

    assert.strictEqual(kde(0), 0.0987654321);
    assert.strictEqual(kde(1), 0.1975308642);
    assert.strictEqual(kde(2), 0.2962962963);
    assert.strictEqual(kde(3), 0.3949617284);
    assert.strictEqual(kde(4), 0.4936271605);
    assert.strictEqual(kde(5), 0.5922925926);

    done();
  });
});
