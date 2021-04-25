e = new Promise((resolve, reject) => {
  reject(11);
})
  .catch((err) => {
    console.log("err", err);
  })
  .then(() => {
    console.log(3333);
    return Promise.reject(22);
  })
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log(999);
  });
console.log(a);
