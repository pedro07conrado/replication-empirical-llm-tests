let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.Op.length', function(done) {
    let op1 = { retain: 5 };
    let op2 = { insert: 'hello' };
    let op3 = { delete: 10 };

    assert.strictEqual(length(op1), 5);
    assert.strictEqual(length(op2), 5);
    assert.strictEqual(length(op3), 10);

    done();
  });
});
