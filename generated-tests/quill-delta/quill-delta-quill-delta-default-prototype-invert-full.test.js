let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.invert', function(done) {
    const delta = new Delta().insert('Hello').delete(1).retain({ bold: true });
    const invertedDelta = delta.invert(delta);
    assert.deepEqual(invertedDelta.ops, [
      { insert: 'H' },
      { delete: 1 },
      { retain: { bold: false } }
    ]);
    done();
  });
});
