var singleNumber = function(nums) {
  let ans = 0;

  for (const num of nums) {
    ans ^= num;
    console.log(ans, num);
  }
};

const nums = [1, 2, 6, 1, 2];

console.log(singleNumber(nums));
