// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。
// [[1,1,2],
//  [1,2,1],
//  [2,1,1]]
var permuteUnique = function(nums) {
  const length = nums.length;
  nums = nums.sort((a, b) => a - b);
  const obj = {};
  const totalArr = [];
  function dfs(arr) {
    if (arr.length === length) return totalArr.push(arr);
    for (let i = 0; i < length; i++) {
      if (obj[i]) continue;
      // 不好理解
      if (i > 0 && nums[i - 1] === nums[i] && !obj[i - 1]) continue;

      obj[i] = true;
      dfs([...arr, nums[i]], i);
      obj[i] = false;
    }
  }

  dfs("");

  return totalArr;
};
console.log(permuteUnique([1, 1, 2]));
console.log(permuteUnique([3, 3, 0, 3]));
