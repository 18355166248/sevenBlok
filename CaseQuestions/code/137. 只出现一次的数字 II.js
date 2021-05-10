var singleNumber = function(nums) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    if (map[nums[i]]) {
      if (map[nums[i]] == 2) delete map[nums[i]];
      else map[nums[i]] += 1;
    } else map[nums[i]] = 1;
  }

  return Object.keys(map)[0];
};

const nums = [2, 2, 3, 2];
const nums2 = [0, 1, 0, 1, 0, 1, 99];

// console.log(singleNumber(nums));
console.log(singleNumber(nums2));
