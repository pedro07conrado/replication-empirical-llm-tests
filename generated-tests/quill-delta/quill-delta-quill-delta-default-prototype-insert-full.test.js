let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.insert', function(done) {
    const delta = new pkg.default();
    let result;

    // Test with a simple string
    result = delta.insert('Hello, World!');
    assert.deepEqual(result.ops[0], { insert: 'Hello, World!' });

    // Test with an empty string
    result = delta.insert('');
    assert.deepEqual(result.ops.length, 0);

    // Test with attributes
    const attrs = { bold: true };
    result = delta.insert('Bold Text', attrs);
    assert.deepEqual(result.ops[1], { insert: 'Bold Text', attributes: attrs });

    // Test with a string and no attributes
    result = delta.insert('No Attributes Here');
    assert.deepEqual(result.ops[2], { insert: 'No Attributes Here' });

    done();
  });
});
