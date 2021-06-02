// 两个整数之间的汉明距离指的是这两个数字对应二进制位不同的位置的数目。
// 给出两个整数 x 和 y，计算它们之间的汉明距离
var hammingDistance = function(x, y) {
  x = x.toString(2);
  y = y.toString(2);
  const maxLength = Math.max(x.length, y.length);
  let num = 0;

  x = x.padStart(maxLength, 0);
  y = y.padStart(maxLength, 0);
  for (let i = 0; i < maxLength; i++) {
    if (x[i] !== y[i]) num++;
  }

  return num;
};

console.log(hammingDistance(1, 4));
