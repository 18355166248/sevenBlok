// 规则
// 设置列表的第一个值为锚点, 从索引1开始判断值是否比锚点小 小的话放在left中, 大的话放在right中, 递归遍历left和right再次进行循环

function quickSort(list) {
  function rec(list) {
    if (list.length <= 1) return list;
    const left = [];
    const right = [];
    const mid = list[0];
    for (let i = 1; i < list.length; i++) {
      if (list[i] < mid) {
        left.push(list[i]);
      } else {
        right.push(list[i]);
      }
    }
    return [...rec(left), mid, ...rec(right)];
  }

  return rec(list);
}

console.log(quickSort([9, 2, 3]));
console.log(quickSort([9, 2, 3, 8, 1, 5, 7, 4, 6]));
