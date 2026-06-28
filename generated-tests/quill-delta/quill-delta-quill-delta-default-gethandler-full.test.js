let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.getHandler', function(done) {
    const delta = new pkg.Delta();
    const handler = delta.handlers['image'];
    if (!handler) {
      throw new Error(`no handlers for embed type "image"`);
    }
    assert.strictEqual(handler, delta.handlers['image']);
    done();
  });
});
