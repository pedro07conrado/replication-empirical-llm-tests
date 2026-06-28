let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.permutationTest', function(done) {
    // Test with two independent samples and a two-sided alternative hypothesis
    var sampleX = [1, 2, 3];
    var sampleY = [4, 5, 6];
    var result = pkg.permutationTest(sampleX, sampleY, "two_side", 1000);
    assert(result >= 0 && result <= 1, 'p-value should be between 0 and 1');
    done();
  });
});
