let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.transform', function(done) {
    const delta1 = new Delta().insert('Hello').delete(2).retain(3);
    const delta2 = new Delta().insert('World');
    const result = delta1.transform(delta2, true);

    assert.strictEqual(result.ops.length, 4);
    assert.deepStrictEqual(result.ops[0], { retain: 5 });
    assert.deepStrictEqual(result.ops[1], { insert: 'W' });
    assert.deepStrictEqual(result.ops[2], { delete: 3 });
    assert.deepStrictEqual(result.ops[3], { retain: 3 });

    done();
  });
});
