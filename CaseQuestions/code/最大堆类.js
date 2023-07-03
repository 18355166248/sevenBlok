class MaxHeap {
  constructor(nums) {
    this.heap = nums;
    // 从最下的非根节点开始 循环
    for (let i = this.getParentIndex(nums.length); i >= 0; i--) {
      this.shiftUp(i);
    }
  }

  getParentIndex(i) {
    return Math.floor(i / 2) - 1;
  }
  getLeftIndex(i) {
    return i * 2 + 1;
  }
  getRightIndex(i) {
    return i * 2 + 2;
  }
  // 往上移动
  shiftUp(i) {
    const leftIndex = this.getLeftIndex(i);
    const rightIndex = this.getRightIndex(i);
    let target = i;
    if (target < this.size() && this.heap[leftIndex] > this.heap[target]) {
      // 节点索引小于列表长度, 且左子节点值大于节点值 更大的往上移动
      target = leftIndex;
    }
    if (target < this.size() && this.heap[rightIndex] > this.heap[target]) {
      // 节点索引小于列表长度, 且左子节点值大于节点值 更大的往上移动
      target = rightIndex;
    }

    // 如果比对后索引不等一一开始的索引 就相互切换位置 并针对新的索引做上移
    if (target !== i) {
      this.swap(i, target);
      this.shiftUp(target);
    }
  }

  // 删除堆顶 并将堆底置为堆顶 循环移动
  shift() {
    this.heap[0] = this.heap.pop();
    this.shiftUp(0);
  }

  size() {
    return this.heap.length;
  }

  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }

  peek() {
    return this.heap[0];
  }
}

module.exports = MaxHeap;

const h = new MaxHeap([3, 21, 1, 6, 4]);
// h.insert(22);
// h.insert(7);
// h.shift();

// console.log(h.heap);

// constructor(nums) {
//   this.heap = nums;
//   for (let i = this.getParentIndex(nums.length); i >= 0; i--) {
//     this.shiftDown(i);
//   }
// }

// swap(i1, i2) {
//   const temp = this.heap[i1];
//   this.heap[i1] = this.heap[i2];
//   this.heap[i2] = temp;
// }

// getParentIndex(i) {
//   return Math.floor(i / 2) - 1; // 最后一个非叶子节点
// }

// getLeftIndex(i) {
//   return i * 2 + 1;
// }

// getRightIndex(i) {
//   return i * 2 + 2;
// }

// insert(val) {
//   this.heap.unshift(val);
//   this.shiftDown(0);
// }

// // 往下降
// shiftDown(i) {
//   const leftIndex = this.getLeftIndex(i); // 查询左子树索引
//   const rightIndex = this.getRightIndex(i); // 查询右子树索引
//   let target = i;
//   if (leftIndex < this.size() && this.heap[leftIndex] > this.heap[target]) {
//     // 索引小于左子树互换位置
//     target = leftIndex;
//   }
//   if (rightIndex < this.size() && this.heap[rightIndex] > this.heap[target]) {
//     // 索引小于右子树互换位置
//     target = rightIndex;
//   }

//   if (target !== i) {
//     this.swap(target, i);
//     this.shiftDown(target);
//   }
// }

// // 删除堆顶, 并将堆底设置到堆顶 往下降
// shift() {
//   this.heap[0] = this.heap.pop();
//   this.shiftDown(0);
// }

// size() {
//   return this.heap.length;
// }

// peek() {
//   return this.heap[0];
// }
