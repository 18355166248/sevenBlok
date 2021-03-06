// 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

var generateParenthesis = function(n) {
  if (n === 0) return []
  if (n === 1) return ['()']

  const res = []

  var getParentTheses = function(str, left, right) {
    // 左括号右括号剩余数都为0 str就是结果
    if (left === 0 && right === 0) {
      res.push(str)
      return
    }
    if (left === right) {
      // 左右括号剩余数相等的情况下, 首先使用左括号
      getParentTheses(str + '(', left - 1, right)
    } else {
      // 当左右括号剩余数不相等, 那么可以用左括号也可以用右括号, 但是用左括号必须还有左括号才行
      if (left > 0) {
        getParentTheses(str + '(', left - 1, right)
      }

      getParentTheses(str + ')', left, right - 1)
    }
  }

  getParentTheses('', n, n)

  return res
}

console.log(generateParenthesis(3))
