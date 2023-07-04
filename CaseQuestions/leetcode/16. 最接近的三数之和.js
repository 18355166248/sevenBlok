// 给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。

var threeSumClosest = function(nums, target) {
  // 先对数组进行排序, 为了后面双指针计算大小值做准备
  nums = nums.sort((a, b) => a - b);
  let min = +Infinity,
    result = 0;

  for (let i = 0; i < nums.length; i++) {
    // 循环内部声明左右指针, 初始化 左指针位于索引下一个, 右指针位于数组最后一位索引
    let left = i + 1,
      right = nums.length - 1;

    // 结束条件为左右指针重合
    while (left < right) {
      // 每次用3个索引计算合然后更新最小值
      const sum = nums[i] + nums[left] + nums[right];
      const res = sum - target;
      if (Math.abs(res) < min) {
        min = Math.abs(res);
        result = sum;
      }

      // 如果合的值大于目标值target, 那么表示需要减少合值再计算, 所以右指针后退一位, 反之左指针前进一位
      if (res >= 0) {
        right--;
      } else {
        left++;
      }
    }
  }

  return result;
};

const nums = [-1, 2, 1, -4],
  target = 1;

console.log(threeSumClosest(nums, target));

// 深度遍历 dfs
// var threeSumClosest = function(nums, target) {
//   let min = +Infinity,
//     res = 0;
//   obj = {};
//   const dfs = function(arr, start) {
//     if (arr.length === 3) {
//       const sum = arr[0] + arr[1] + arr[2];
//       const r = Math.abs(sum - target);
//       if (r < min) {
//         min = r;
//         res = sum;
//       }
//       return;
//     }
//     for (let i = start; i < nums.length; i++) {
//       if (i >= nums.length - 2 && arr.length === 0) break;
//       if (obj[i]) continue;
//       obj[i] = true;
//       dfs([...arr, nums[i]], i + 1);
//       obj[i] = false;
//     }
//   };

//   dfs([], 0);

//   return res;
// };
