// 规则
// 将列表数据分割成一个一个小块 对比大小填充到新的列表中

function mergeSort(list) {
  function dfs(list) {
    if (list.length === 1) return list;
    const res = [];

    const mid = Math.floor(list.length / 2);
    const left = list.slice(0, mid);
    const right = list.slice(mid);
    const orderLeft = dfs(left);
    const orderRight = dfs(right);

    while (orderLeft.length || orderRight.length) {
      if (orderLeft.length && orderRight.length) {
        res.push(
          orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift()
        );
      } else if (orderLeft.length) {
        res.push(orderLeft.shift());
      } else {
        res.push(orderRight.shift());
      }
    }

    return res;
  }

  return dfs(list);
}

console.log(mergeSort([9, 2, 3]));
console.log(mergeSort([9, 2, 3, 8, 1, 5, 7, 4, 6]));
