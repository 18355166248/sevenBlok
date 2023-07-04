function strStr(haystack, needle) {
  const len = needle.length;
  for (let i = 0; i < haystack.length - len + 1; i++) {
    const str = haystack.substr(i, len);
    if (str === needle) return i;
  }

  return -1;
}

console.log(strStr("hello", "ll"));
