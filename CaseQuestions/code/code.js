/**
 * @param {string} s
 * @return {number}
 */
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
}
var romanToInt = function(s) {
  let num = 0
  while (s.length > 0) {
    const s2 = s.substring(0, 2)
    if (enumObj[s2]) {
      s = s.substr(2)
      num += enumObj[s2]
    } else {
      num += enumObj[s.charAt(0)]
      s = s.substr(1)
    }
  }

  return num
}

console.log(romanToInt('LVIII'))
