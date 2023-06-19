// 防抖
function throttle(fn, delay) {
  let time;
  let datePur = Date.now();

  return function() {
    const that = this;
    const args = arguments;
    const now = Date.now();

    if (now - datePur < delay && time) {
      return;
    }

    time = setTimeout(function() {
      time = null;
      datePur = Date.now();
    }, delay);

    fn.apply(that, args);
  };
}

function log(name) {
  console.log("name:", name);
}

cb = throttle(log, 200);

cb("李哥");

setTimeout(function() {
  cb("李哥1");
}, 100);

setTimeout(function() {
  cb("李哥1.1");
}, 150);

setTimeout(() => {
  cb("李哥2");
}, 200);

setTimeout(() => {
  cb("李哥3");
}, 300);

setTimeout(function() {
  cb("李哥3.1");
}, 350);

setTimeout(() => {
  cb("李哥4");
}, 500);
