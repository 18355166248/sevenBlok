// 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
// 进阶：你可以设计并实现时间复杂度为 O(n) 的解决方案吗？
var longestConsecutive = function(nums) {
  const set = new Set();
  let maxLength = 0;

  for (const num of nums) {
    set.add(num);
  }

  for (const s of set) {
    if (!set.has(s - 1)) {
      let num = s,
        curlenth = 1;

      while (set.has(num + 1)) {
        curlenth++;
        num++;
      }

      maxLength = Math.max(maxLength, curlenth);
    }
  }

  return maxLength;
};
console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
