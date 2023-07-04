// 实现获取 下一个排列 的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列。
// 如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。
// 必须 原地 修改，只允许使用额外常数空间。
var nextPermutation = function(nums) {
  // 倒序, 算出第一个前面数字大于后面数组的索引
  let i = nums.length - 2;

  // 找到第一个小于右侧数字的索引
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    i--;
  }

  // 这个数在数组中存在, 从最后往前找到第一个比i大的数字
  if (i >= 0) {
    let j = nums.length - 1;

    while (j >= 0 && nums[j] <= nums[i]) {
      j--;
    }
    // 这几个数百分百存在的 所以直接交换就行了
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // 假如说这个数为-1, 那么就直接翻转数组
  // 如果这个数不是-1, 就对i右侧的数据排序, 取最小值, 这样的话最后的数组就是最小的值
  let l = i + 1;
  let r = nums.length - 1;
  while (l < r) {
    if (nums[l] > nums[r]) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
    }
    l++;
    r--;
  }

  return nums;
};

console.log(nextPermutation([1, 2, 3]));
console.log(nextPermutation([3, 2, 1]));
console.log(nextPermutation([1, 1, 5]));
console.log(nextPermutation([1]));
console.log(nextPermutation([1, 3, 2]));
console.log(nextPermutation([5, 4, 7, 5, 3, 2]));
