# curry柯里化

```js
 ```function curry(fn, args) {
  var length = fn.length;

  args = args || [];

  return function() {
    var _args = args;

    for (let i = 0; i < arguments.length; i++) {
      _args.push(arguments[i]);
    }

    if (_args.length < length) {
      return curry.call(this, fn, _args);
    } else {
      return fn.apply(this, args);
    }
  };
}

const fn = curry(function(a, b, c, d) {
  console.log(a, b, c, d);
});

fn(1)(2)(4)(10);
