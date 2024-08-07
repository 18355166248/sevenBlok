// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
// 子数组 是数组中的一个连续部分。

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  if (nums.length === 1) return nums[0];

  let pre = 0;
  let max = nums[0];
  nums.forEach((num) => {
    pre = Math.max(pre + num, num);
    max = Math.max(max, pre);
  });
  return max;
};

console.log(maxSubArray([-2, 1, 4, -1])); // 5
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([5, 4, -1, 7, 8])); // 23
console.log(maxSubArray([-2, -1])); // -1
