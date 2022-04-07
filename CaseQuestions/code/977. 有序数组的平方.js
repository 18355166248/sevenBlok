// 给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {
  if (nums.length === 1) return [nums * nums];
  let mid = 0;
  let newNums = [];

  if (nums[0] < 0 && nums[nums.length - 1] >= 0) {
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < 0 && nums[i + 1] >= 0) {
        mid = i;
        break;
      }
    }

    let left = mid,
      right = mid + 1;
    while (left >= 0 && right < nums.length) {
      if (-nums[left] < nums[right]) {
        newNums.push(Math.pow(nums[left--], 2));
      } else {
        newNums.push(Math.pow(nums[right++], 2));
      }
    }

    if (left >= 0) {
      for (let i = left; i >= 0; i--) {
        newNums.push(Math.pow(nums[i], 2));
      }
    } else {
      for (let i = right; i < nums.length; i++) {
        newNums.push(Math.pow(nums[i], 2));
      }
    }
  } else if (nums[nums.length - 1] < 0) {
    for (let i = nums.length - 1; i >= 0; i--) {
      newNums.push(Math.pow(nums[i], 2));
    }
  } else {
    newNums = pow(nums);
  }

  return newNums;
};

function pow(list) {
  return list.map((num) => Math.pow(num, 2));
}
console.log(sortedSquares([-4, -1, 0, 3, 10])); // [0,1,9,16,100]
console.log(sortedSquares([-4, -3, -1, 0, 3])); // [0, 1, 9, 9, 16]
console.log(sortedSquares([-7, -3, 2, 3, 11])); // [4,9,9,49,121]
console.log(sortedSquares([-5, -3, -2, -1])); // [1,4,9,25]
console.log(sortedSquares([-10000, -9999, -7, -5, 0, 0, 10000])); // [0,0,25,49,99980001,100000000,100000000]
