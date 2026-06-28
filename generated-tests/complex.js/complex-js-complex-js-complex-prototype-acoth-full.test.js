let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.acoth', function(done) {
    // Test case: acoth(0)
    let z1 = new Complex(0, 0);
    let result1 = z1['acoth']();
    assert.strictEqual(result1['re'], 0);
    assert.strictEqual(result1['im'], Math.PI / 2);

    // Test case: acoth(1 + i)
    let z2 = new Complex(1, 1);
    let result2 = z2['acoth']();
    assert.strictEqual(result2['re'], -Math.log(Math.sqrt(2)) / 4);
    assert.strictEqual(result2['im'], Math.log(Math.sqrt(2)) / 4);

    // Test case: acoth(-1 + i)
    let z3 = new Complex(-1, 1);
    let result3 = z3['acoth']();
    assert.strictEqual(result3['re'], -Math.log(Math.sqrt(2)) / 4);
    assert.strictEqual(result3['im'], -Math.log(Math.sqrt(2)) / 4);

    // Test case: acoth(i)
    let z4 = new Complex(0, 1);
    let result4 = z4['acoth']();
    assert.strictEqual(result4['re'], Math.PI / 4);
    assert.strictEqual(result4['im'], 0);

    done();
  });
});
