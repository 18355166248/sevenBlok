/**
 * @param {string} expression
 * @return {number[]}
 */

var diffWaysToCompute = function(expression) {
  if (expression.length === 1) return [Number(expression)];

  const codeArr = ["+", "-", "*"];

  const arr = expression.match(/([0-99]+)|[-|*|+]+/g);
  return dfs(arr);

  function dfs(arr) {
    if (arr.length <= 3) {
      return [eval(arr.join(""))];
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

    return res;
  }
};

// console.log(diffWaysToCompute("2-1-1")); // [0,2]
// console.log(diffWaysToCompute("2*3-4*5")); // [-34,-14,-10,-10,10]
console.log(diffWaysToCompute("2-1-1-1-1")); //
