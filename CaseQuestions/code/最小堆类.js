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
    if (this.heap[parentIndex] > this.heap[index]) {
      // 当前值大于父级索引
      this.swap(index, parentIndex); // 交换位置
      this.shiftUp(parentIndex); // 继续往上
    }
  }
  // 往下降
  shiftDown(i) {
    const leftIndex = this.getLeftIndex(i); // 查询左子树索引
    const rightIndex = this.getRightIndex(i); // 查询右子树索引
    if (this.heap[leftIndex] < this.heap[i]) {
      // 索引大于左子树互换位置
      this.swap(leftIndex, i);
      this.shiftDown(leftIndex);
    }
    if (this.heap[rightIndex] < this.heap[i]) {
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

module.exports = MiniHeap;

const h = new MiniHeap();
h.insert(3);
h.insert(2);
h.insert(1);
h.pop();

// console.log(h.heap);
