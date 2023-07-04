// 规则
// 循环对比最小值, 记录最小值的索引, 遍历完后将最小值的索引和最左边没有确定的索引位置调换
// 循环最左边没有确定的值到最右边
function selectedSort(list) {
  for (let i = 0; i < list.length - 1; i++) {
    let midIndex = i;
    for (let j = i + 1; j < list.length; j++) {
      if (list[midIndex] > list[j]) {
        midIndex = j;
      }
    }
    if (i !== midIndex) {
      const temp = list[midIndex];
      list[midIndex] = list[i];
      list[i] = temp;
    }
  }
  return list;
}

console.log(selectedSort([9, 2, 3]));
console.log(selectedSort([9, 2, 3, 8, 1, 5, 7, 4, 6]));
