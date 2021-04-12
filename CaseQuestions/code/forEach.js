function forEach (arr, fn) {
  return new Promise(resolve => {
    next(arr)
    function next (arr, i = 0) {
      const item = arr[i]
      const res = fn(item)

      if (Object.prototype.toString.call(res) === '[object Promise]') {
        res.then(r => {
          arr[i] = r

          if (i === arr.length - 1) {
            resolve(arr)
            return
          }

          next(arr, i + 1)
        })
      } else {
        arr[i] = res

        if (i === arr.length - 1) {
          resolve(arr)
          return
        }

        next(arr, i + 1)
      }
    }
  })
}


const arr = [1, 2, 3]
const p = function Pro (item) {
  return item * 3
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(item * 2)
  //   }, 1000);
  // })
}
forEach(arr, p).then(res => {
  console.log(res);
})

