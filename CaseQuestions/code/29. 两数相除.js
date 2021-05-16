// 给定两个整数，被除数 dividend 和除数 divisor。将两数相除，要求不使用乘法、除法和 mod 运算符。

const { number } = require('yargs')

// 返回被除数 dividend 除以除数 divisor 得到的商。

// 整数除法的结果应当截去（truncate）其小数部分，例如：truncate(8.345) = 8 以及 truncate(-2.7335) = -2

var divide = function(dividend, divisor) {
  if (dividend === -2147483648 && divisor === -1) return 2147483648

  let sum = 0,
    t = 0,
    sums = 0,
    ts = 0,
    sumss = 0,
    tss = 0,
    res = 0

  const flat = dividend ^ divisor
  dividend = dividend < 0 ? dividend : -dividend
  divisor = divisor < 0 ? divisor : -divisor

  while (dividend <= divisor) {
    sum += divisor
    t--
    sums += sum
    ts += t
    sumss += sums
    tss += ts
    if (dividend - sumss < 0 && sumss < 0) {
      console.log(11, tss)
      res += tss
      dividend -= sumss
    } else {
      res--
      dividend -= divisor
      sum = 0
      t = 0
      sums = 0
      ts = 0
      sumss = 0
      tss = 0
    }
  }

  return flat < 0 ? -res : res
}

// console.log(divide(10, 3))
console.log(divide(100, 3))
// console.log(divide(7, 3))
// console.log(divide(7, -3))
// console.log(divide(0, 1))
// console.log(divide(-1, 1))
// console.log(divide(-1, -1))
// console.log(divide(-2147483648, -1))
