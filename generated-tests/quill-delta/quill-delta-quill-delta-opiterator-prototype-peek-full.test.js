let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.OpIterator.prototype.peek', function(done) {
    let opIterator = new pkg.OpIterator();
    opIterator.ops = [1, 2, 3];
    opIterator.index = 0;

    assert.strictEqual(opIterator.peek(), 1);

    done();
  });
});
