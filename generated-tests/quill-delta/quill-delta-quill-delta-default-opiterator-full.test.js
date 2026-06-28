let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.OpIterator', function(done) {
    const ops = [
      { insert: 'Hello' },
      { retain: 5 },
      { delete: 3 }
    ];
    const iterator = new pkg.default.OpIterator(ops);
    
    assert.strictEqual(iterator.hasNext(), true, 'Iterator should have next');
    assert.deepStrictEqual(iterator.next(), { insert: 'Hello' }, 'First operation is correct');
    assert.strictEqual(iterator.peekLength(), 5, 'Peek length should be 5');
    assert.deepStrictEqual(iterator.rest(), [{ retain: 5 }], 'Rest of operations are correct');
    assert.strictEqual(iterator.hasNext(), true, 'Iterator should have next after rest');
    assert.deepStrictEqual(iterator.next(), { delete: 3 }, 'Next operation is correct');
    
    done();
  });
});
