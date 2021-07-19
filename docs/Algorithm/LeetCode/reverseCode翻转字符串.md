# reverseCode翻转字符串

function reverseCode(s) {
  const sArr = s.split("");
  let start = 0;
  let end = sArr.length - 1;

  while (start < end) {
    [sArr[start++], sArr[end--]] = [sArr[end], sArr[start]];
  }

  return sArr.join("");
}

console.log(reverseCode("1234"));
