// 实现 pow(x, n) ，即计算 x 的 n 次幂函数（即，xn）。
var myPow = function(x, n) {
  const obj = {};
  return get(n);
  function get(n) {
    if (n === 0) return 1;
    if (n === 1) return x;
    if (n === -1) return 1 / x;
    if (n === -2) return 1 / (x * x);

    const ban = n > 0 ? Math.floor(n / 2) : Math.ceil(n / 2);
    const yu = n % 2;

    let res, yuRes;

    if (obj[ban]) {
      res = obj[ban];
    } else {
      res = get(ban);
      obj[ban] = res;
    }

    if (obj[yu]) {
      yuRes = obj[yu];
    } else {
      yuRes = get(yu);
      obj[yu] = yuRes;
    }

    return res * res * yuRes;
  }
};
console.log(myPow(2, 10));
console.log(myPow(2.1, 3));
console.log(myPow(2, -2));
console.log(myPow(34.00515, -3));
