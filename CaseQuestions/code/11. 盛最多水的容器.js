var maxArea = function(height) {
  let max = 0,
    min = 0;
  for (let i = 0; i < height.length - 1; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const mh = Math.min(height[i], height[j]);
      if (mh < min) continue;
      min = mh;
      max = Math.max(mh * (j - i), max);
    }
  }

  return max;
};

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
console.log(maxArea([4, 3, 2, 1, 4]));
console.log(maxArea([1, 2, 1]));
