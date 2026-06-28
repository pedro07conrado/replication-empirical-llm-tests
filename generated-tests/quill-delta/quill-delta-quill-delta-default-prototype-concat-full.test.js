let mocha = require('mocha');
let assert = require('assert');
let pkg = require('quill-delta');

describe('test quill-delta', function() {
  it('test quill-delta.default.prototype.concat', function(done) {
    const delta1 = new Delta([{ insert: 'Hello' }]);
    const delta2 = new Delta([{ insert: ' World' }]);

    const result = delta1.concat(delta2);

    assert.strictEqual(result.ops.length, 2);
    assert.strictEqual(result.ops[0].insert, 'Hello');
    assert.strictEqual(result.ops[1].insert, ' World');

    done();
  });
});
