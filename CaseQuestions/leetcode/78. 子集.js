// 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。

// 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

// 示例 1：
// 输入：nums = [1,2,3]
// 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

// 示例 2：
// 输入：nums = [0]
// 输出：[[],[0]]

var subsets = function(nums) {
  const arr = [];

  function deps(index, list) {
    if (index === nums.length) {
      arr.push(list.slice());
      return;
    }

    list.push(nums[index]);
    // console.log("before", list);
    deps(index + 1, list);
    console.log("after", list);
    list.pop();
    deps(index + 1, list);
  }

  deps(0, []);

  return arr;
};

const arr = [1, 2, 3];
subsets(arr);
// console.log(subsets(arr));
