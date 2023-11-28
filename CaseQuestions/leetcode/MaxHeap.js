class MaxHeap {
  constructor(nums) {
    this.heap = nums;
    // 从最低非根节点往上排序
    for (let i = this.getParentIndex(nums.length); i >= 0; i--) {
      this.shiftUp(i);
    }
  }

  getParentIndex(i) {
    return Math.floor(i / 2) + 1;
  }
  getLeftIndex(i) {
    return i * 2 + 1;
  }
  getRightIndex(i) {
    return i * 2 + 2;
  }
  shiftUp(i) {
    const left = this.getLeftIndex(i);
    const right = this.getRightIndex(i);
    const length = this.size();
    let target = i;
    if (left < length && this.heap[left] > this.heap[target]) {
      target = left;
    }
    if (right < length && this.heap[right] > this.heap[target]) {
      target = right;
    }
    if (target !== i) {
      this.move(target, i);
      this.shiftUp(target);
    }
  }
  move(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
  shift() {
    this.heap[0] = this.heap.pop();
    this.shiftUp(0);
  }
  size() {
    return this.heap.length;
  }
  peek() {
    return this.heap[0];
  }
}

var findKthLargest = function(nums, k) {
  const heap = new MaxHeap(nums);
  console.log(heap);
  for (i = 0; i < k - 1; i++) {
    heap.shift();
  }

  return heap.peek();
};

console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));
