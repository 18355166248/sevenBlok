function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("a");
    }, 200);
  });
}
function b() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("b");
    }, 100);
  });
}
function c() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("c");
    }, 150);
  });
}

function PromiseAll(list) {
  return new Promise((resolve, reject) => {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      list[i]
        .then((r) => {
          res[i] = r;
          if (res.filter(v => v).length === list.length) {
            resolve(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

PromiseAll([a(), b()])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

PromiseAll([a(), c(), b()])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
