// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。
var merge = function(intervals) {
  // 先对数组排序, 以数组中的第一个值排序
  intervals = intervals.sort((a, b) => a[0] - b[0]);
  const arr = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const cur = intervals[i];
    const prev = arr[arr.length - 1];
    // 判断上一个已存在区间和当前区间,当前区间的开始值小于上一个区间的开始值, 取当前区间开始值
    if (cur[0] <= prev[0]) {
      prev[0] = cur[0];
    }

    if (prev[1] > cur[1]) {
      // 上一个区间结束值大于当前区间结束值, 则什么也不做
    } else if (prev[1] >= cur[0]) {
      // 不满足上一个条件, 上一个区间结束值大于当前开始值, 更新上一个结束值为当前结束值
      prev[1] = cur[1];
    } else {
      // 不满足上面2个条件
      arr.push(cur);
    }
  }

  return arr;
};

// console.log(
//   merge([
//     [1, 3],
//     [2, 6],
//     [8, 10],
//     [15, 18],
//   ])
// ); // [[1,6],[8,10],[15,18]]
// console.log(
//   merge([
//     [1, 4],
//     [4, 5],
//   ])
// ); // [[1,5]]
// console.log(
//   merge([
//     [1, 4],
//     [0, 4],
//   ])
// ); // [0,4]]
// console.log(
//   merge([
//     [1, 4],
//     [1, 5],
//   ])
// ); // [1,5]]
console.log(
  merge([
    [1, 4],
    [0, 1],
  ])
); // [0,4]]
console.log(
  merge([
    [1, 4],
    [0, 0],
  ])
); // [[0,0],[1,4]]
