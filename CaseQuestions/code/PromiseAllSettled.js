Promise.allSettled = function(list) {
  return new Promise((resolve) => {
    const res = [];
    list.forEach((item, index) => {
      item
        .then((r) => {
          res[index] = { status: "fulfilled", value: r };
        })
        .catch((err) => {
          console.log(index);
          res[index] = { status: "rejected", reason: err };
        })
        .finally(() => {
          if (res.filter((v) => v).length === list.length) {
            resolve(res);
          }
        });
    });
  });
};

function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(11);
    }, 200);
  });
}

function b() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(Error("b 出错了"));
    }, 300);
  });
}

Promise.allSettled([a(), b()]).then((res) => {
  console.log(res);
});

// [
//   { status: 'fulfilled', value: 11 },
//   { status: 'rejected', reason: Error('b 出错了') }
// ]
