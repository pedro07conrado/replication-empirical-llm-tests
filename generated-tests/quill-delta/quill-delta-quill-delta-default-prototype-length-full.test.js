let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.length', function(done) {
    let delta = new pkg.default();
    assert.strictEqual(delta.length(), 0);

    delta.insert('Hello, World!');
    assert.strictEqual(delta.length(), 12);

    delta.delete(5);
    assert.strictEqual(delta.length(), 7);

    delta.ops.push({ insert: '!' });
    assert.strictEqual(delta.length(), 8);

    done();
  });
});
