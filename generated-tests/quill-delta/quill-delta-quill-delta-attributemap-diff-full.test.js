let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.AttributeMap.diff', function(done) {
    const a = { color: 'red' };
    const b = { color: 'blue', size: 'large' };
    const result = pkg.AttributeMap.diff(a, b);
    assert.deepEqual(result, { color: 'blue', size: 'large' }, 'Test with different values');
    
    const c = { color: 'red' };
    const d = { color: 'red' };
    const result2 = pkg.AttributeMap.diff(c, d);
    assert.strictEqual(result2, undefined, 'Test with identical values');

    const e = {};
    const f = { size: 'large' };
    const result3 = pkg.AttributeMap.diff(e, f);
    assert.deepEqual(result3, { size: 'large' }, 'Test with only b has attributes');
    
    const g = { color: 'red' };
    const h = {};
    const result4 = pkg.AttributeMap.diff(g, h);
    assert.deepEqual(result4, { color: null }, 'Test with only a has attributes');

    const i = { color: 'red', size: 'large' };
    const j = { color: 'blue', size: 'small' };
    const result5 = pkg.AttributeMap.diff(i, j);
    assert.deepEqual(result5, { color: 'blue', size: 'small' }, 'Test with different values for both attributes');

    done();
  });
});
