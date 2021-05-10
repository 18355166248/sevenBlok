const enumObj = {
  I: 1,
  IV: 4,
  V: 5,
  IX: 9,
  X: 10,
  XL: 40,
  L: 50,
  XC: 90,
  C: 100,
  CD: 400,
  D: 500,
  CM: 900,
  M: 1000,
};

var romanToInt = function(s) {
  let num = 0;

  while (s.length > 0) {
    if (enumObj[s.substring(0, 2)]) {
      num += enumObj[s.substring(0, 2)];
      s = s.substr(2);
    } else {
      num += enumObj[s[0]];
      s = s.substr(1);
    }
  }

  return num;
};

const s1 = "III";
const s2 = "IV";
const s3 = "IX";
const s4 = "LVIII";
const s5 = "MCMXCIV";

console.log(romanToInt(s1));
console.log(romanToInt(s2));
console.log(romanToInt(s3));
console.log(romanToInt(s4));
console.log(romanToInt(s5));
