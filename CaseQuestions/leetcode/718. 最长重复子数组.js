// 给两个整数数组 nums1 和 nums2 ，返回 两个数组中 公共的 、长度最长的子数组的长度 。
// 示例 1：
// 输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
// 输出：3
// 解释：长度最长的公共子数组是 [3,2,1] 。
// 示例 2：
// 输入：nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
// 输出：5

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function(nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let res = 0;
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = nums1[i] === nums2[j] ? dp[i + 1][j + 1] + 1 : 0;
      res = Math.max(dp[i][j], res);
    }
  }
  return res;
};

console.log(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]));
console.log(findLength([0, 0, 0, 0, 0], [0, 0, 0, 0, 0]));
