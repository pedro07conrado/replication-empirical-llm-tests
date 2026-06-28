let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.OpIterator.prototype.peekType', function(done) {
    const opIterator = new pkg.OpIterator();
    opIterator.ops = [{ retain: 10 }];
    assert.strictEqual(opIterator.peekType(), 'retain');
    done();
  });
});
