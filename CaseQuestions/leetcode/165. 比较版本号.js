var compareVersion = function(version1, version2) {
  version1 = version1.split(".");
  version2 = version2.split(".");
  version1 = version1.map((str) => Number(str));
  version2 = version2.map((str) => Number(str));

  const length1 = version1.length;
  const length2 = version2.length;

  const length = Math.max(length1, length2);

  for (let i = 0; i < length; i++) {
    const a = version1[i] || 0;
    const b = version2[i] || 0;
    if (a === b) {
      continue;
    } else if (a > b) {
      return 1;
    } else {
      return -1;
    }
  }

  return 0;
};

console.log(compareVersion("1.01", "1.001")); // 0
console.log(compareVersion("1.0", "1.0.0")); // 0
console.log(compareVersion("0.1", "1.1")); // -1
console.log(compareVersion("1.0.1", "1")); // 1
console.log(compareVersion("7.5.2.4", "7.5.3")); // -1
console.log(compareVersion("10.3", "11")); // -1
