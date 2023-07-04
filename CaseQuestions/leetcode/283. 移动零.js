// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

// 请注意 ，必须在不复制数组的情况下原地对数组进行操作。
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  if (nums.length <= 1) return nums;
  let left = 0,
    right = nums.length - 2;

  while (left <= right) {
    if (nums[left] === 0) {
      nums.splice(left, 1);
      nums.push(0);
    } else {
      left++;
    }
    if (nums[right] === 0) {
      nums.splice(right, 1);
      nums.push(0);
    }
    right--;
  }

  console.log(count, nums);
};

moveZeroes([0, 1, 0, 3, 12]); // [ 1, 3, 12, 0, 0 ]
moveZeroes([0]); //  [0]
moveZeroes([1, 0, 2, -1, -4, -3, 0, 0, 5, 3, 0, 98]); //  [ 1,2,-1,-4,-3,5,3,98,0,0,0,0]
