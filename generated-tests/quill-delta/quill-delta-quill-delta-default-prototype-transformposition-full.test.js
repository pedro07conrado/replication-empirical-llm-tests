let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.transformPosition', function(done) {
    const delta = new pkg.default();
    delta.ops.push({ insert: 'Hello' });
    delta.ops.push({ delete: 5 });

    assert.strictEqual(delta.transformPosition(0), 0);
    assert.strictEqual(delta.transformPosition(1), 1);
    assert.strictEqual(delta.transformPosition(2), 2);
    assert.strictEqual(delta.transformPosition(3), 3);
    assert.strictEqual(delta.transformPosition(4), 4);
    assert.strictEqual(delta.transformPosition(5), 0);

    done();
  });
});
