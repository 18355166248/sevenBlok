const s = "PAYPALISHIRING";

// 边界条件 如果numsRows等于1 表示结果就为s 直接返回
// 去字符串长度和行数中的最大值, 如果行数大于字符串最大值, 直接返回
// 先设置rows表示总共有几行数据
// 定义loc表示当前在第几行, down表示这一列是否循环结束
// 如果当前行是在第一行或者在最后一行, 那么down就需要改变相反状态
// 如果down是true的话表示向下(行)加1, 如果down为false, 表示向上(行)减一
var convert = function(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;
  const len = s.length;
  const rows = [];
  for (let i = 0; i < len; i++) rows[i] = "";

  let loc = 0;
  let down = false;

  for (let c of s) {
    rows[loc] += c;

    if (loc === 0 || loc === numRows - 1) down = !down;
    loc += down ? 1 : -1;
  }

  return rows.join("");
};

convert(s, 5);
