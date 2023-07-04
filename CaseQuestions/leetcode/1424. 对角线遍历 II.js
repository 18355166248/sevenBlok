const { array } = require("yargs");

var findDiagonalOrder = function(nums) {
  let arrays = [],
    result = [];

  for (let i = 0; i < nums.length; i++) {
    // for (let j = nums[i].length - 1; j >= 0; j--) {
    //   if (!arrays[i + j]) arrays[i + j] = [];
    //   arrays[i + j].push(nums[i][j]);
    // }
    for (let j = 0; j < nums[i].length; j++) {
      if (!arrays[i + j]) arrays[i + j] = [];
      arrays[i + j].push(nums[i][j]);
    }
  }

  console.log(arrays);

  arrays.forEach((array) => (result = result.concat(array)));

  return result;
};

const nums = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(findDiagonalOrder(nums));
