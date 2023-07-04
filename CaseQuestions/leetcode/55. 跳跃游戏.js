// 给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。
// 数组中的每个元素代表你在该位置可以跳跃的最大长度。
// 判断你是否能够到达最后一个下标。
var canJump = function(nums) {
  if (nums.length <= 1) return true;
  const length = nums.length;
  let maxStep = 0;

  for (let i = 0; i < length; i++) {
    if (i <= maxStep) {
      maxStep = Math.max(maxStep, i + nums[i]);
      if (maxStep > length - 1) return true;
    }
  }

  return false;
};
console.log(canJump([2, 3, 1, 1, 4]));
console.log(canJump([0]));

console.log(canJump([3, 2, 1, 0, 4]));
