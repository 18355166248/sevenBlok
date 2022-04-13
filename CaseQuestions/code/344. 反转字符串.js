/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
  if (s.length === 1) return;
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  console.log(s);
};

reverseString(["h", "e", "l", "l", "o"]); // ["o","l","l","e","h"]
reverseString(["H", "a", "n", "n", "a", "h"]); // ["h","a","n","n","a","H"]
reverseString(["H"]); // ["H"]
