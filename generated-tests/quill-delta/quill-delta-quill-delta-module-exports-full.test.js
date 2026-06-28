let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.module.exports', function(done) {
    const delta = new pkg.Delta([{ insert: 'Hello' }]);
    assert.strictEqual(delta.ops[0].insert, 'Hello');
    done();
  });
});
