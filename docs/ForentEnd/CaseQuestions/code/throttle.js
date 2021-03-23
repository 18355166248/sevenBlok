function throttle(fn, wait) {
  var time;
  var date = Date.now();

  return function() {
    var context = this;
    var args = arguments;
    var newDate = Date.now();

    if (newDate - date > wait) {
      fn.apply(context, args);
      date = newDate;
      clearTimeout(time);
      time = null;
    } else {
      time = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  };
}

function add() {
  console.log(666);
}

const a = throttle(add, 500);

setTimeout(a, 400);
setTimeout(a, 450);
setTimeout(a, 550);
setTimeout(a, 600);
