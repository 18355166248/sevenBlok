// 给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。
class MiniHeap {
  constructor() {
    this.heap = [];
  }

  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
    // [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  getParentIndex(i) {
    return (i - 1) >> 1; // 二进制向右移动一位 表示 / 2
  }

  getLeftIndex(i) {
    return i * 2 + 1;
  }

  getRightIndex(i) {
    return i * 2 + 2;
  }

  // 往上升
  shiftUp(index) {
    if (index === 0) return; // 到顶部暂停
    const parentIndex = this.getParentIndex(index); // 获取父级索引
    if (this.heap[parentIndex][1] > this.heap[index][1]) {
      // 当前值大于父级索引
      this.swap(index, parentIndex); // 交换位置
      this.shiftUp(parentIndex); // 继续往上
    }
  }
  // 往下降
  shiftDown(i) {
    const leftIndex = this.getLeftIndex(i); // 查询左子树索引
    const rightIndex = this.getRightIndex(i); // 查询右子树索引
    if (this.heap[leftIndex] && this.heap[leftIndex][1] < this.heap[i][1]) {
      // 索引大于左子树互换位置
      this.swap(leftIndex, i);
      this.shiftDown(leftIndex);
    }
    if (this.heap[rightIndex] && this.heap[rightIndex][1] < this.heap[i][1]) {
      // 索引大于右子树互换位置
      this.swap(rightIndex, i);
      this.shiftDown(rightIndex);
    }
  }

  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }

  // 删除堆顶
  pop() {
    // 不能直接删除堆顶, 可能会造成堆顶不是最小值, 将尾部移动到堆顶做替换, 并执行向下降 动态将最小值移动到堆顶
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }
}
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    map.set(nums[i], map.has(nums[i]) ? map.get(nums[i]) + 1 : 1);
  }
  const minHeap = new MiniHeap();

  map.forEach((nums, value) => {
    minHeap.insert([value, nums]);
    if (minHeap.size() > k) {
      minHeap.pop();
    }
  });

  return minHeap.heap.map((v) => v[0]);
};

console.log(topKFrequent([1, 1, 1, 2, 2, 3, 4], 2)); // [1,2]

// console.log(topKFrequent([1], 1)); // [1]
