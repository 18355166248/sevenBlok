// 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  if (nums.length === 0) return -1;
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const l = nums[left],
      r = nums[right];
    if (l !== undefined && r !== undefined) {
      if (l === target) {
        return left;
      } else {
        left++;
      }
      if (r === target) {
        return right;
      } else {
        right--;
      }
    }
  }

  return -1;
};

console.log(search([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log(search([[-1, 0, 3, 5, 9, 12]], 2)); // -1
