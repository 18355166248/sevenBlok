// 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

// 输出：
// 示例 2：
// 输入：nums = [0,1]
// 输出：[[0,1],[1,0]]
// 示例 3：
// 输入：nums = [1]
// 输出：[[1]]
var permute = function(nums) {
  const length = nums.length;
  const totalArr = [];
  function dfs(arr) {
    if (arr.length === length) return totalArr.push(arr);
    for (let i = 0; i < length; i++) {
      if (!arr.includes(nums[i])) {
        dfs([...arr, nums[i]]);
      }
    }
  }

  dfs("");

  return totalArr;
};
console.log(permute([1, 2, 3])); // [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
