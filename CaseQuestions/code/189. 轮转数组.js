// 给你一个数组，将数组中的元素向右轮转 k 个位置，其中 k 是非负数

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
  if (k === 0) return nums;

  k = k % nums.length;

  
};

rotate([1, 2, 3, 4, 5, 6, 7], 3); // [5,6,7,1,2,3,4]
rotate([1, 2], 3); // [5,6,7,1,2,3,4]
