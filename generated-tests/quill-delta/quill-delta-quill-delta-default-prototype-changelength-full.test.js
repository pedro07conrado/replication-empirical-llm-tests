let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.changeLength', function(done) {
    let delta = new pkg.Delta();
    delta.insert('hello');
    delta.delete(2);

    assert.strictEqual(delta.changeLength(), 3, 'The length of the delta should be 3');

    done();
  });
});
