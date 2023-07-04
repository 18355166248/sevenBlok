// 给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。

var multiply = function(num1, num2) {
  if (num1 === "0" || num2 === "0") return "0";
  const oneLen = num1.length,
    twoLen = num2.length;
  const arr = Array(oneLen + twoLen).fill(0);

  for (let i = oneLen; i--; ) {
    for (let j = twoLen; j--; ) {
      const res = num1[i] * num2[j] + arr[i + j + 1];
      arr[i + j + 1] = res % 10;
      arr[i + j] += 0 | (res / 10); // 小于1 取0, 大于1 取其值整数部分
    }
  }

  while (arr[0] === 0) {
    arr.shift();
  }
  return arr.join("");
};

console.log(multiply("2", "3")); // 6
console.log(multiply("123", "456")); // 56088
