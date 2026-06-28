let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.default', function(done) {
    const delta = new Delta([{ insert: 'Hello' }]);
    assert.strictEqual(delta.ops.length, 1);
    assert.deepStrictEqual(delta.ops[0], { insert: 'Hello' });
    done();
  });
});
