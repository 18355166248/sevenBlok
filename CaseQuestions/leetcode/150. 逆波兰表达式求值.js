var evalRPN = function(tokens) {
  if (!tokens.length) return 0;
  const arr = [];
  const symbol = ["+", "-", "*", "/"];

  for (let i = 0; i < tokens.length; i++) {
    const item = tokens[i];
    if (symbol.includes(item)) {
      const right = arr.pop();
      const left = arr.pop();

      switch (item) {
        case "+":
          arr.push(+left + +right);
          break;
        case "-":
          arr.push(+left - +right);
          break;
        case "*":
          arr.push(+left * +right);
          break;
        case "/":
          arr.push(parseInt(+left / +right));
          break;
      }
    } else {
      arr.push(item);
    }
  }

  return arr.pop();
};
console.log(evalRPN(["2", "1", "+", "3", "*"]));
console.log(evalRPN(["4", "13", "5", "/", "+"]));
console.log(evalRPN(["1"]));
console.log(evalRPN([]));
console.log(
  evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"])
);
console.log(evalRPN(["4", "-2", "/", "2", "-3", "-", "-"]));
