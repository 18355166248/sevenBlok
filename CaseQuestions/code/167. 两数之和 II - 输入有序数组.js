// 给你一个下标从 1 开始的整数数组 numbers ，该数组已按 非递减顺序排列  ，请你从数组中找出满足相加之和等于目标数 target 的两个数。如果设这两个数分别是 numbers[index1] 和 numbers[index2] ，则 1 <= index1 < index2 <= numbers.length 。

// 以长度为 2 的整数数组 [index1, index2] 的形式返回这两个整数的下标 index1 和 index2。

// 你可以假设每个输入 只对应唯一的答案 ，而且你 不可以 重复使用相同的元素。

// 你所设计的解决方案必须只使用常量级的额外空间。

/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
  let length = numbers.length - 1;

  for (let i = 0; i < length; i++) {
    let low = i + 1,
      high = length;

    while (low <= high) {
      const mid = Math.ceil((high - low) / 2) + low;
      if (numbers[mid] + numbers[i] === target) {
        return [i + 1, mid + 1];
      } else if (numbers[mid] + numbers[i] > target) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
  }
};

console.log(twoSum([2, 7, 11, 15], 9)); // [1, 2]
console.log(twoSum([2, 3, 4], 6)); // [1, 3]
console.log(twoSum([-1, 0], -1)); // [1, 2]
