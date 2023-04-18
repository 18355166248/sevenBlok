const arr = [1, 2, [4, 5, [6, 7], [8, [0, [12, 4]], 56]]];

function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}

console.log([...flatten(arr)]);
