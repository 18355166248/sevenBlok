// 罗马数字包含以下七种字符： I， V， X， L，C，D 和 M。

// 字符          数值
// I             1
// V             5
// X             10
// L             50
// C             100
// D             500
// M             1000
// 例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

// 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

// I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
// X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
// C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
// 给定一个整数，将其转为罗马数字。输入确保在 1 到 3999 的范围内。

// 解法: 贪心算法
/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
  const enumList = [
    {
      val: 1000,
      name: "M",
    },
    {
      val: 900,
      name: "CM",
    },
    {
      val: 500,
      name: "D",
    },
    {
      val: 400,
      name: "CD",
    },
    {
      val: 100,
      name: "C",
    },
    {
      val: 90,
      name: "XC",
    },
    {
      val: 50,
      name: "L",
    },
    {
      val: 40,
      name: "XL",
    },
    {
      val: 10,
      name: "X",
    },
    {
      val: 9,
      name: "IX",
    },
    {
      val: 5,
      name: "V",
    },
    {
      val: 4,
      name: "IV",
    },
    {
      val: 1,
      name: "I",
    },
  ];

  let str = "";

  while (num > 0) {
    if (enumList[0].val <= num) {
      const { name, val } = enumList[0];
      str += name;
      num -= val;
    } else enumList.shift();
  }

  return str;
};

// console.log(intToRoman(19));
// console.log(intToRoman(478));
console.log(intToRoman(671));

// 解法: 贪心
// 首先声明一个序列, 此序列从大到小排序
// 按照规则, 尽可能用大的符号, 我们寻找到适合的最大字符后, 将数字减去最大字符对应的数字, 继续循环查找, 如果序列最大字符大于数字, 就将序列的第一位删除, 继续循环
// 直到数字删除到0为止
// 我们取出的字符都要累加到一个变量上
