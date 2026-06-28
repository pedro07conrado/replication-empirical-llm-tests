let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.OpIterator.prototype.next', function(done) {
    const delta = new pkg.Delta([
      { insert: 'Hello' },
      { retain: 5 },
      { delete: 3 }
    ]);
    const iterator = delta.iterate();
    
    assert.strictEqual(iterator.next().insert, 'ello');
    assert.strictEqual(iterator.next().retain, 2);
    assert.strictEqual(iterator.next().delete, 1);
    assert.strictEqual(iterator.next(), null);

    done();
  });
});
