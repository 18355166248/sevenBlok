class MaxHeap {
  constructor(nums) {
    this.heap = nums;

    for (let i = this.findParentIndex(nums.length); i >= 0; i--) {
      this.shiftUp(i);
    }
  }

  findParentIndex(i) {
    return Math.floor(i / 2) - 1;
  }
  findLeftIndex(i) {
    return i * 2 + 1;
  }
  findRightIndex(i) {
    return i * 2 + 2;
  }
  shiftUp(i) {
    const left = this.findLeftIndex(i);
    const right = this.findRightIndex(i);
    const size = this.size();
    let target = i;
    if (left < size && this.heap[left] > this.heap[target]) {
      target = left;
    }
    if (right < size && this.heap[right] > this.heap[target]) {
      target = right;
    }
    if (target !== i) {
      this.move(i, target);
      this.shiftUp(target);
    }
  }
  move(i, target) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[target];
    this.heap[target] = temp;
  }
  size() {
    return this.heap.length;
  }
  // 删除堆底 重新从头排列
  shift() {
    this.heap[0] = this.heap.pop();
    this.shiftUp(0);
  }
  peek() {
    return this.heap[0];
  }
}

module.exports = MaxHeap;
