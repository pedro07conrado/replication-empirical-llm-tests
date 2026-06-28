let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.delete', function(done) {
    let delta = new pkg.default();
    delta.push({ insert: 'Hello' });
    delta.push({ delete: 5 });

    assert.strictEqual(delta.ops.length, 2);
    assert.deepStrictEqual(delta.ops[0], { insert: 'Hello' });
    assert.deepStrictEqual(delta.ops[1], { delete: 5 });

    done();
  });
});
