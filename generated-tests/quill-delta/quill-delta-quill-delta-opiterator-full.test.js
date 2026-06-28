let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.OpIterator', function(done) {
    const ops = [
      { insert: 'Hello' },
      { retain: 5 },
      { delete: 3 }
    ];
    const iterator = new pkg.Iterator(ops);
    
    assert.strictEqual(iterator.hasNext(), true, 'Should have next operation');
    assert.deepStrictEqual(iterator.next(), { insert: 'Hello' }, 'First operation should be an insert');
    assert.strictEqual(iterator.peekLength(), 5, 'Next operation length should be 5');
    assert.deepStrictEqual(iterator.rest(), [{ retain: 5 }], 'Rest of operations should be a single retain');
    assert.strictEqual(iterator.hasNext(), true, 'Should have next operation after rest');
    assert.deepStrictEqual(iterator.next(3), { delete: 3 }, 'Next operation should be a delete');
    
    done();
  });
});
