# currentCode

// function countPrimes(num) {
//   if (num === 0 || num === 1 || num === 2) return true;
//   const isPrimes = Array(num).fill(true);
//   const total = [];

//   for (let i = 2; i < num; i++) {
//     if (isPrimes[i]) {
//       total.push(i);
//       for (let j = i * i; j < num; j += i) {
//         isPrimes[j] = false;
//       }
//     }
//   }

//   return total;
// }

// console.log(countPrimes(20));

var strStr = function(haystack, needle) {
  if (needle === "" || haystack === needle) return 0;
  const s = needle.length;
  const l = haystack.length;

  for (let i = 0; i < l - s + 1; i++) {
    const str = haystack.substring(i, i + s);
    if (str === needle) return i;
  }

  return -1;
};

console.log(2 === strStr("hellpw", "ll"));
console.log(-1 === strStr("aaaaa", "bba"));
console.log(5 === strStr("aaaaahe", "he"));
console.log(0 === strStr("a", "a"));
console.log(2 === strStr("abc", "c"));
console.log(4 === strStr("mississippi", "issip"));
