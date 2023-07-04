// 给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
// 此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
var sortColors = function(nums) {
  const obj = {};

  for (let i = 0; i < nums.length; i++) {
    if (obj[nums[i]]) {
      obj[nums[i]] += 1;
    } else {
      obj[nums[i]] = 1;
    }
  }

  const arr = Object.keys(obj).sort((a, b) => a - b);

  const a = [];
  let c = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < obj[arr[i]]; j++) {
      nums[c++] = +arr[i];
    }
  }
};
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0,0,1,1,2,2]
console.log(sortColors([2, 0, 1]));
