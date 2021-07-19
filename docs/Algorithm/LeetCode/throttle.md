# throttle

```js
 ```function throttle(fn, wait) {
  var time;

  return function() {
    var context = this;
    var args = arguments;

    if (!time) {
      time = setTimeout(() => {
        time = null
        fn.call(context, args)
      }, wait);
    }
  };
}

function add() {
  console.log(666);
}

const a = throttle(add, 500);

setTimeout(a, 400);
setTimeout(a, 950);
setTimeout(a, 1250);
setTimeout(a, 1550);
