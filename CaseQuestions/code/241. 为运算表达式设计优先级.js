/**
 * @param {string} expression
 * @return {number[]}
 */

var diffWaysToCompute = function(expression) {
  if (expression.length === 1) return [Number(expression)];

  const codeArr = ["+", "-", "*"];

  const map = new Map();

  const arr = expression.match(/([0-99]+)|[-|*|+]+/g);
  return dfs(arr);

  function dfs(arr) {
    const key = arr.join("");
    if (map.has(key)) {
      console.log("key", key);
      return map.get(key);
    }

    if (arr.length <= 1) {
      const res = [eval(key)];
      map.set(key, res);
      return res;
    }
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      if (codeArr.includes(arr[i])) {
        const left = dfs(arr.slice(0, i));
        const right = dfs(arr.slice(i + 1));
        for (let x = 0; x < left.length; x++) {
          for (let j = 0; j < right.length; j++) {
            res.push(eval(`${left[x]} ${arr[i]} ${right[j]}`));
          }
        }
      }
    }

    map.set(key, res);
    return res;
  }
};

var diffWaysToCompute = function(input) {
  // 预处理
  input = input.split("");
  const nums = [];
  const operation = [];
  let num = 0;
  for (let i = 0; i < input.length; i++) {
    if (["+", "-", "*"].includes(input[i])) {
      nums.push(num);
      num = 0;
      operation.push(input[i]);
      continue;
    }
    num = num * 10 + Number(input[i]);
  }
  nums.push(num);
  // 状态机
  const dp = Array.from({ length: nums.length }, () => {
    return new Array(nums.length).fill([]);
  });
  const operate = (a, b, o) => {
    if (o == "+") return a + b;
    else if (o == "-") return a - b;
    else if (o == "*") return a * b;
  };
  // 初始状态
  for (let i = 0; i < nums.length; i++) dp[i][i] = [nums[i]];
  // 从俩个数字开始，因为数组从0开始，所以，n=1开始
  for (let n = 1; n < nums.length; n++) {
    for (let start = 0; start + n < nums.length; start++) {
      const end = start + n;
      const res = [];
      for (let i = start; i < end; i++) {
        const left = dp[start][i];
        const right = dp[i + 1][end];
        // 结算
        for (const num1 of left) {
          for (const num2 of right) {
            res.push(operate(num1, num2, operation[i]));
          }
        }
      }
      dp[start][end] = res;
    }
  }
  return dp[0][nums.length - 1];
};

console.log(diffWaysToCompute("2-1-1")); // [0,2]
console.log(diffWaysToCompute("2*3-4*5")); // [-34,-14,-10,-10,10]
console.log(diffWaysToCompute("2-1-1-1-1")); //
