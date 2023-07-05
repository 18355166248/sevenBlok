// 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
// 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
  const list = [];

  function back(index, path) {
    list.push(path);

    for (let i = index; i < nums.length; i++) {
      back(i + 1, path.concat(nums[i]));
    }
  }

  back(0, []);

  return list;
};

console.log(subsets([1, 2, 3])); // [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
// console.log(subsets([0])); // [[],[0]]
