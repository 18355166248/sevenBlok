// 规则
// 第一个表明为已排序的, 从第二个开始往左对比, 如果比它大就将左侧的的值往右移动一位 这样的话就空出来一个位置, 直到循环结束或者左边的值小于目标值, 停止循环
// 将目标值赋值到空出的位置, 插入成功 循环上面步骤

function inSertSort(list) {
  for (let i = 1; i < list.length; i++) {
    const temp = list[i];
    let j = i;
    while (j) {
      if (list[j - 1] > temp) {
        list[j] = list[j - 1];
      } else {
        break;
      }
      j--;
    }

    list[j] = temp;
  }

  return list;
}

console.log(inSertSort([9, 2, 3]));
console.log(inSertSort([9, 2, 3, 8, 1, 5, 7, 4, 6]));
