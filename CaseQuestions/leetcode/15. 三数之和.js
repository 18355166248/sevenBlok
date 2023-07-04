// 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

// 注意：答案中不可以包含重复的三元组。
var threeSum = function(nums) {
  if (nums.length < 3) return [];

  // 排序
  nums = nums.sort((a, b) => a - b);

  const arr = [];

  for (let i = 0; i < nums.length - 2; i++) {
    const n1 = nums[i];
    if (n1 > 0) break; // 如果第一个大于0, 表示后面的和肯定不会等于0, 直接停止
    if (i - 1 >= 0 && nums[i - 1] === n1) continue;

    // 第一层循环内, 使用左右指针的概念进行遍历查找, 其实就是多指针+
    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const n2 = nums[left],
        n3 = nums[right];

      // 先判断三指针和是否为0 ,如果是就左右指针往里排重收缩
      // 如果三指针合不为0, 再判断是否小于0. 如果小于0, 表示值小了 左指针前进
      // 反之右指针后退
      if (n1 + n2 + n3 === 0) {
        arr.push([n1, n2, n3]);

        // 在拿到3数之和为0之后, 需要判断是否有重复数, 如果有, 就指针往里收缩, 知道没有相等的树
        while (left < right && nums[left] === n2) left++;
        while (left < right && nums[right] === n3) right++;
      } else if (n1 + n2 + n3 < 0) {
        // 和小于0 那么左指针前进
        left++;
      } else {
        // 和大于0 右指针后退
        right--;
      }
    }
  }

  return arr;
};

const nums = [-1, 0, 1, 2, -1, -4];
const nums2 = [0, 0, 0, 0];

console.log(threeSum(nums));
console.log(threeSum(nums2));
