let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.diff', function(done) {
    const delta1 = new pkg.Delta().insert('Hello, ');
    const delta2 = new pkg.Delta().insert('World!').delete(5);
    const cursor = { index: 0, length: 0 };

    const result = delta1.diff(delta2, cursor);

    assert.strictEqual(result.ops.length, 3);
    assert.deepStrictEqual(result.ops[0], { insert: 'Hello,' });
    assert.deepStrictEqual(result.ops[1], { delete: 5 });
    assert.deepStrictEqual(result.ops[2], { insert: 'World!' });

    done();
  });
});
