let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.OpIterator.prototype.hasNext', function(done) {
    let opIterator = new pkg.OpIterator();
    // Test case: hasNext should return false when there are no more operations
    assert.strictEqual(opIterator.hasNext(), false);

    // Test case: hasNext should return true when there is at least one operation
    opIterator.push({ insert: 'test' });
    assert.strictEqual(opIterator.hasNext(), true);

    done();
  });
});
