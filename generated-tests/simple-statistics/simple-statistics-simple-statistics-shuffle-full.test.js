let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.shuffle', function(done) {
    let array = [1, 2, 3, 4, 5];
    let shuffledArray = pkg.shuffle(array);

    // Check if the original array is not modified
    assert.deepEqual(array, [1, 2, 3, 4, 5]);

    // Check if the shuffled array has different elements
    assert.notDeepEqual(shuffledArray, array);

    // Check if the length of both arrays is the same
    assert.strictEqual(shuffledArray.length, array.length);

    // Check if all elements in the original array are present in the shuffled array
    let allElementsPresent = true;
    for (let i = 0; i < array.length; i++) {
      if (!shuffledArray.includes(array[i])) {
        allElementsPresent = false;
        break;
      }
    }
    assert(allElementsPresent);

    // Check if the shuffled array is not in the same order as the original array
    let isShuffled = true;
    for (let i = 0; i < array.length - 1; i++) {
      if (shuffledArray[i] > shuffledArray[i + 1]) {
        isShuffled = false;
        break;
      }
    }
    assert(isShuffled);

    done();
  });
});
