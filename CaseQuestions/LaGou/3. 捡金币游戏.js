// const arr = [1, -1, -100, -1000, 100, 3];
const arr = [100, -1, -100, -1, 100];
const k = 2;

function getNums(arr, k) {
  const line = [],
    get = [];
  for (let i = 0; i < arr.length; i++) {
    if (i - k > 0) {
      // 这里将超过队列长度的清除(出队)
      if (line.length > 0 && line[0] === get[i - k - 1]) {
        line.shift();
      }
    }
    // 这里的old是上一个队列的最大值
    const old = line.length === 0 ? 0 : line[0];
    get[i] = old + arr[i];

    // 这里是为了清空队列中小的值, 将最大的值放在get的第一个索引
    // get[i]就是王队列末尾加的值, 他要跟队列前面几个对对比, 如果队列前面几个都比get[i]小的话, 那么都要清除, 保证队列第一个位置是最大值
    console.log(line, get[i]);
    while (line.length > 0 && line[line.length - 1] < get[i]) {
      line.pop();
    }

    line.push(get[i]);
  }

  console.log(get);
}

console.log(getNums(arr, k));
