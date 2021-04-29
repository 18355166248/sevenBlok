const iterator = {
  [Symbol.iterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 5) return { value: this.i++, done: false };
        //   return Promise.resolve({ value: this.i++, done: false });

        // return Promise.resolve({ donw: true });
        return { done: true };
      },
    };
  },
};

// console.log(Array.from([...iterator]));
// console.log(new Set(iterator));
// for (let value of iterator) {
//   console.log(value);
// }

const asyncIterator = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 5)
          return Promise.resolve({ value: this.i++, done: false });

        return Promise.resolve({ done: true });
      },
    };
  },
};

(async function() {
  for await (let value of asyncIterator) {
    console.log(value);
  }
})();
