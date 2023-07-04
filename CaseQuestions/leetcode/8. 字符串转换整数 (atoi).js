var myAtoi = function(s) {
  let str = parseInt(s, 10);
  const max = 2147483647,
    min = -2147483648;

  if (isNaN(str)) return 0;
  else if (str > max || str < min) {
    return str > max ? max : min;
  } else return str;
};

const a = "-42";
const b = "-91283472332";
const c = "words and 987";
const d = "-91283472332";
const e = "  0000000000012345678";

console.log(myAtoi(a));
console.log(myAtoi(b));
console.log(myAtoi(c));
console.log(myAtoi(d));
console.log(myAtoi(e));
