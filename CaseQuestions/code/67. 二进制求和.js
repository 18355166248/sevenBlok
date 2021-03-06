// 给你两个二进制字符串，返回它们的和（用二进制表示）。
// 输入为 非空 字符串且只包含数字 1 和 0。
var addBinary = function(a, b) {
  let i = a.length - 1,
    j = b.length - 1,
    res = "",
    c = 0;
  while (i >= 0 || j >= 0 || c) {
    let aa = +a[i--] || 0;
    let bb = +b[j--] || 0;
    let total = aa + bb + c;
    c = (total / 2) | 0; //  单竖线取整
    total %= 2;
    res = total + "" + res;
  }

  return res;
};
console.log(addBinary("11", "1"));
console.log(addBinary("1010", "1011"));
