# Promise 并发控制 

// 页面上有三个按钮，分别为 A、B、C，点击各个按钮都会发送异步请求且互不影响，每次请求回来的数据都为按钮的名字。
// 请实现当用户依次点击 A、B、C、A、C、B 的时候，最终获取的数据为 ABCACB。
const Create = function() {
  const tasks = [];
  let first = true;

  async function clean() {
    if (tasks.length > 0) {
      tasks[0].then((res) => {
        console.log(res);
        tasks.splice(0, 1);
        clean();
      });
    }
  }

  return function(promise) {
    tasks.push(promise);

    first && (clean(), (first = false));
  };
};

const create = Create();

function A() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("A");
    }, 1000);
  });
}
function B() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("B");
    }, 3000);
  });
}
function C() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("C");
    }, 4000);
  });
}

create(A());
create(B());
create(C());
create(A());
create(C());
create(B());
