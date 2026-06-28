let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.partition', function(done) {
    const delta = new pkg.Delta();
    delta.insert('Hello, World!').insert('\n').delete(5);

    const isInsertion = (op) => op.insert !== undefined;
    const [insertions, deletions] = delta.partition(isInsertion);

    assert.strictEqual(insertions.length, 2);
    assert.strictEqual(deletions.length, 1);

    done();
  });
});
