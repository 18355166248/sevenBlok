function isValid(s) {
  if (s.length % 2 === 1) return false;
  const map = new Map([
    ["}", "{"],
    ["]", "["],
    [")", "("],
  ]);

  const res = [];

  for (let i = 0; i < s.length; i++) {
    if (map.has(s[i])) {
      if (!res.length || res[res.length - 1] !== map.get(s[i])) {
        res.length = 1;
        break;
      }

      res.pop();
    } else {
      res.push(s[i]);
    }
  }

  return !res.length;
}
const s0 = "()";
const s = "{[]}";
const s1 = "()[]{}";
const s2 = "(([]){})";
const s3 = "){";
const s4 = "([}}])";

// console.log(isValid(s0));
// console.log(isValid(s));
// console.log(isValid(s1));
// console.log(isValid(s2));
// console.log(isValid(s3));
console.log(isValid(s4));
