var numDecodings = function(s) {
  const n = s.length
  let a = 0,
    b = 1,
    c = 0
  for (let i = 1; i <= n; i++) {
    c = 0
    if (s[i - 1] !== '0') {
      c += b
    }

    if (i > 1 && s[i - 2] !== '0' && s[i - 2] * 10 + +s[i - 1] <= 26) {
      c += a
    }

    a = b
    b = c
  }

  return c
}
console.log(numDecodings('12')) // 2
console.log(numDecodings('11106')) // 2
console.log(numDecodings('111111111111111111111111111111111111111111111')) // 2
