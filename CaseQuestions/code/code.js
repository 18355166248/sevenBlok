function clearStr(str) {
  let res = "";

  function clear(string) {
    let isOpen = false;
    for (i = 0; i < string.length - 2; i++) {
      let left = string.charAt([i + 1]);
      let right = string.charAt([i + 2]);

      if (string[i] === left && string[i] === right) {
        isOpen = true;
        clear(string.substr(0, i) + string.substr(i + 3));
        break;
      }
    }
    if (!isOpen) res = string;
  }

  clear(str);

  return res;
}

console.log(clearStr("aabbccdddcbae"));
console.log(clearStr("aabbba"));
console.log(clearStr("caabbbaccc"));
