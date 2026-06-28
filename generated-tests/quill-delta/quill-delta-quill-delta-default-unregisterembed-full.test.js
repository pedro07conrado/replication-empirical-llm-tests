let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.unregisterEmbed', function(done) {
    // Create a new instance of QuillDelta
    let delta = new pkg.default();

    // Define an embed type to unregister
    const embedType = 'my-embed-type';

    // Register the embed with a dummy handler
    delta.handlers[embedType] = () => {};

    // Call the unregisterEmbed function
    delta.unregisterEmbed(embedType);

    // Check if the embed type has been deleted from handlers
    assert.strictEqual(delta.handlers.hasOwnProperty(embedType), false, 'The embed type should not exist in handlers');

    done();
  });
});
