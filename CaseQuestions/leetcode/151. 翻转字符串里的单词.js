var reverseWords = function(s) {
  s = s.trim();
  if (!s) return s;

  return s
    .replace(/\s+/g, "j6_+")
    .split("j6_+")
    .reverse()
    .join(" ");
};
console.log(reverseWords("the sky  is  blue "));
console.log(reverseWords("  hello world  "));
console.log(reverseWords("a good   example"));
console.log(reverseWords("  Bob    Loves  Alice   "));
console.log(reverseWords("Alice does not even like bob"));
