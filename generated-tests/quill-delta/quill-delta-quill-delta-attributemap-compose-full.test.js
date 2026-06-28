let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.AttributeMap.compose', function(done) {
    let a = { bold: true, color: 'red' };
    let b = { italic: true, color: null };
    let result = pkg.AttributeMap.compose(a, b);
    assert.deepStrictEqual(result, { bold: true, italic: true }, 'Attributes should be composed correctly');
    
    let c = {};
    let d = { underline: true };
    let result2 = pkg.AttributeMap.compose(c, d);
    assert.deepStrictEqual(result2, { underline: true }, 'Empty object with attribute should return the attribute');

    let e = { bold: false };
    let f = { bold: true };
    let result3 = pkg.AttributeMap.compose(e, f);
    assert.deepStrictEqual(result3, { bold: true }, 'True value overwrites false value');

    let g = { bold: true };
    let h = {};
    let result4 = pkg.AttributeMap.compose(g, h);
    assert.deepStrictEqual(result4, { bold: true }, 'Empty object should not affect existing attributes');

    let i = { bold: true };
    let j = { bold: undefined };
    let result5 = pkg.AttributeMap.compose(i, j);
    assert.deepStrictEqual(result5, { bold: true }, 'Undefined value does not overwrite existing attribute');

    done();
  });
});
