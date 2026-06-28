let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.chop', function(done) {
    const delta = new pkg.Delta();
    delta.ops.push({ retain: 10 });
    delta.ops.push({ insert: 'text' });

    delta.chop();

    assert.strictEqual(delta.ops.length, 1);
    assert.strictEqual(delta.ops[0].retain, 10);

    done();
  });
});
