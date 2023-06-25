// 给定两个数组 nums1 和 nums2 ，返回 它们的交集 。输出结果中的每个元素一定是 唯一 的。我们可以 不考虑输出结果的顺序 。

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
  return [...new Set(nums1)].filter((v) => nums2.includes(v));
};

const nums1 = [1, 2, 2, 1];
const nums2 = [2, 2];
// [2]

// const nums1 = [4, 9, 5];
// const nums2 = [9, 4, 9, 8, 4];
// [9,4]

console.log(intersection(nums1, nums2));
