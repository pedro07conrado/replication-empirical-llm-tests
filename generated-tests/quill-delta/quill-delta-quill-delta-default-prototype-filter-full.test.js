let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.filter', function(done) {
    let delta = new pkg.Delta().insert('Hello').delete(5).insert('World');
    let filteredDelta = delta.filter(op => op.insert !== 'H');
    assert.deepEqual(filteredDelta.ops, [{ insert: 'ello' }, { delete: 5 }, { insert: 'orld' }]);
    done();
  });
});
