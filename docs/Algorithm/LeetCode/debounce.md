# debounce

```js
 ```function debounce(fn, wait) {
  var time;

  return function() {
    var context = this;
    var args = arguments;

    clearTimeout(time);
    time = setTimeout(() => {
      time = null;
      fn.apply(context, args);
    }, wait);
  };
}

function add() {
  console.log(111);
}

const a = debounce(add, 200);
a();
a();
setTimeout(add, 1000);
