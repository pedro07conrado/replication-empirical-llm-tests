let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.push', function(done) {
    let delta = new pkg.default();
    let op1 = { insert: 'Hello' };
    let op2 = { delete: 5 };

    delta.push(op1);
    assert.deepEqual(delta.ops, [op1]);

    delta.push(op2);
    assert.deepEqual(delta.ops, [{ insert: 'Hello', delete: 5 }]);

    done();
  });
});
