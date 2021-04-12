// 快速排序的思路, 每次取中间值, targetIndex为数组排序后所在的索引
// 每次不需要考虑排序, 只需要知道中间值排序后应该在的索引
// 用这个索引去跟targetIndex比对 如果相等就返回对应的数字
// 如果索引比targetIndex大, 那么代表期望值在左侧队列
// 反之 期望值在右侧队列, 递归查找
function quickSort (arr, targetIndex, start) {
  if (arr.length <= 1) return arr[0];
  let left = [];
  let right = [];
  const mid = Math.floor(arr.length / 2);
  const midNum = arr.splice(mid, 1)[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > midNum) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }

  console.log(left.length, start)

  if (left.length + start === targetIndex) {
    return midNum;
  } else if (left.length + start > targetIndex) {
    return quickSort(left, targetIndex, start);
  } else {
    return quickSort(right, targetIndex, left.length + start + 1);
  }
}

var findKthLargest = function(nums, k) {
  return quickSort(nums, nums.length - k, 0);
};

// console.log(findKthLargest([3, 6, 5, 4, 10, 8, 7, 2, 1], 2));
console.log(findKthLargest([3, 6, 4, 10], 2));
