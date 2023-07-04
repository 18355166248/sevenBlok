// 猜数字游戏的规则如下：

// 每轮游戏，我都会从 1 到 n 随机选择一个数字。 请你猜选出的是哪个数字。
// 如果你猜错了，我会告诉你，你猜测的数字比我选出的数字是大了还是小了。
// 你可以通过调用一个预先定义好的接口 int guess(int num) 来获取猜测结果，返回值一共有 3 种可能的情况（-1，1 或 0）：

// -1：我选出的数字比你猜的数字小 pick < num
// 1：我选出的数字比你猜的数字大 pick > num
// 0：我选出的数字和你猜的数字一样。恭喜！你猜对了！pick == num
// 返回我选出的数字。

/**
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	     -1 if num is higher than the picked number
 *			      1 if num is lower than the picked number
 *               otherwise return 0
 * var guess = function(num) {}
 */

var guess = function(num) {
  if (num > 1702766719) {
    return -1;
  } else if (num < 1702766719) {
    return 1;
  } else {
    return 0;
  }
};
/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
  let min = 0;
  let max = n;
  let mid;
  while (true) {
    mid = Math.floor((max - min) / 2) + min;
    const res = guess(mid);
    if (res === -1) {
      max = mid - 1;
    } else if (res === 1) {
      min = mid + 1;
    } else {
      return mid;
    }
  }
};

// 分而治之
var guessNumber = function(n) {
  function rec(min, max) {
    if (min > max) return;
    const mid = Math.floor((max + min) / 2);
    const res = guess(mid);
    if (res === -1) {
      return rec(min, mid - 1);
    } else if (res === 1) {
      return rec(mid + 1, max);
    } else {
      return mid;
    }
  }
  return rec(1, n);
};

console.log(guessNumber(10));

console.log(guessNumber(2126753390));
// 2126753390
// 1702766719
