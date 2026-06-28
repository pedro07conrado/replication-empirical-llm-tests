let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.OpIterator.prototype.rest', function(done) {
    const opIterator = new pkg.OpIterator([{ insert: 'Hello' }, { delete: 5 }]);
    opIterator.index = 1;
    opIterator.offset = 2;

    assert.deepStrictEqual(opIterator.rest(), [{ delete: 5 }]);

    done();
  });
});
