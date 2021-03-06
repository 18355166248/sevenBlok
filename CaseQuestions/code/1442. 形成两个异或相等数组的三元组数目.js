// 给你一个整数数组 arr 。
// 现需要从数组中取三个下标 i、j 和 k ，其中 (0 <= i < j <= k < arr.length) 。
// a 和 b 定义如下：
// a = arr[i] ^ arr[i + 1] ^ ... ^ arr[j - 1]
// b = arr[j] ^ arr[j + 1] ^ ... ^ arr[k]
// 注意：^ 表示 按位异或 操作。
// 请返回能够令 a == b 成立的三元组 (i, j , k) 的数目。
var countTriplets = function(arr) {
  const length = arr.length;
  const s = [0];

  for (const num of arr) {
    s.push(s[s.length - 1] ^ num);
  }

  let ans = 0;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      for (let k = j; k < length; k++) {
        if (s[i] === s[k + 1]) ans++;
      }
    }
  }

  return ans;
};

console.log(countTriplets([2, 3, 1, 6, 7]));
