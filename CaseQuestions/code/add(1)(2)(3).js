function getNums(a, b, c) {
  console.log(a, b, c);
}

function curly(fn) {
  const length = fn.length;
  let args = [];

  const callback = function() {
    args = [...args, ...arguments];

    if (args.length === length) {
      return fn.apply(this, args);
    }

    return callback;
  };

  return callback;
}

const add = curly(getNums);

// add(1, 2, 3);
// add(1)(2)(3);
// add(1, 2)(3);
add(1)(2, 3);
