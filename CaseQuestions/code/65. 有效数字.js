// 有效数字（按顺序）可以分成以下几个部分：

// 一个 小数 或者 整数
// （可选）一个 'e' 或 'E' ，后面跟着一个 整数
// 小数（按顺序）可以分成以下几个部分：

// （可选）一个符号字符（'+' 或 '-'）
// 下述格式之一：
// 至少一位数字，后面跟着一个点 '.'
// 至少一位数字，后面跟着一个点 '.' ，后面再跟着至少一位数字
// 一个点 '.' ，后面跟着至少一位数字
// 整数（按顺序）可以分成以下几个部分：

// （可选）一个符号字符（'+' 或 '-'）
// 至少一位数字
// 部分有效数字列举如下：["2", "0089", "-0.1", "+3.14", "4.", "-.9", "2e10", "-90E3", "3e+7", "+6e-1", "53.5e93", "-123.456e789"]

// 部分无效数字列举如下：["abc", "1a", "1e", "e3", "99e2.5", "--6", "-+3", "95a54e53"]

// 给你一个字符串 s ，如果 s 是一个 有效数字 ，请返回 true 。

/**
 * @param {string} s
 * @return {boolean}
 */

const graph = {
  0: {
    blank: 0,
    sign: 1,
    ".": 2,
    digit: 6,
  },
  1: { digit: 6, ".": 2 },
  2: { digit: 3 },
  3: { digit: 3, e: 4 }, // true
  4: { digit: 5, sign: 7 },
  5: { digit: 5 }, // true
  6: { digit: 6, ".": 3, e: 4 }, // true
  7: { digit: 5 },
};
var isNumber = function(s) {
  let res = 0;
  for (const key of s) {
    if (res === undefined) return false;

    if (key !== "e" && key !== "E" && key >= "0" && key <= "9") {
      res = graph[res].digit;
    } else if (key === " ") {
      res = graph[res].blank;
    } else if (key === "+" || key === "-") {
      res = graph[res].sign;
    } else if (key === ".") {
      res = graph[res]["."];
    } else if (key === "e" || key === "E") {
      res = graph[res]["e"];
    } else {
      return false;
    }
  }

  return res === 3 || res === 5 || res === 6;
};

console.log(isNumber("0.1234")); // true
console.log(isNumber("e")); // false
console.log(isNumber(".")); // false
console.log(isNumber("+1e")); // false
console.log(isNumber(".1")); // true
console.log(isNumber("e9")); // false
console.log(isNumber("2e0")); // true
console.log(isNumber("1E9")); // true
