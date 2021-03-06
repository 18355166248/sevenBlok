// 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 最多出现两次 ，返回删除后数组的新长度。

// 不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。
var removeDuplicates = function(nums) {
  const enumsObj = {};
  for (let i = nums.length; i >= 0; i--) {
    if (enumsObj[nums[i]]) {
      if (enumsObj[nums[i]] === 2) {
        nums.splice(i, 1);
      } else {
        enumsObj[nums[i]] += 1;
      }
    } else {
      enumsObj[nums[i]] = 1;
    }
  }
  return nums.length;
};
console.log(removeDuplicates([1, 1, 1, 2, 2, 3]));
console.log(removeDuplicates([0, 0, 1, 1, 1, 1, 2, 3, 3])); // 7 [0,0,1,1,2,3,3]
