// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
// 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

// const MiniHeap = require("./最小堆类.js");
const MaxHeap = require("./MaxHeap.js");

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
// TODO 容易超时
// var findKthLargest = function(nums, k) {
//   const heap = new MiniHeap();

//   for (let i = 0; i < nums.length; i++) {
//     heap.insert(nums[i]);
//   }

//   for (let i = 0; i < nums.length - k; i++) {
//     heap.pop();
//   }

//   return heap.peek();
// };

var findKthLargest = function(nums, k) {
  const maxHeap = new MaxHeap(nums);
  for (let i = 0; i < k - 1; i++) {
    maxHeap.shift();
  }

  return maxHeap.peek();
  // 网上的解答
  // let heapSize = nums.length;
  // buildMaxHeap(nums, heapSize); //构建大顶堆 大小为heapSize
  // //大顶堆 前k-1个堆顶元素不断和数组的末尾元素交换 然后重新heapify堆顶元素
  // //这个操作就是之前小顶堆出堆顶的操作，只不过现在是原地排序
  // for (let i = nums.length - 1; i >= nums.length - k + 1; i--) {
  //   swap(nums, 0, i); //交换堆顶和数组末尾元素
  //   --heapSize; //堆大小减1
  //   maxHeapify(nums, 0, heapSize); //重新heapify
  // }
  // return nums[0]; //返回堆顶元素，就是第k大的元素
  // function buildMaxHeap(nums, heapSize) {
  //   for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
  //     //从第一个非叶子节点开始构建
  //     maxHeapify(nums, i, heapSize);
  //   }
  // }
  // // 从左向右，自上而下的调整节点
  // function maxHeapify(nums, i, heapSize) {
  //   let l = i * 2 + 1; //左节点
  //   let r = i * 2 + 2; //右节点
  //   let largest = i;
  //   if (l < heapSize && nums[l] > nums[largest]) {
  //     largest = l;
  //   }
  //   if (r < heapSize && nums[r] > nums[largest]) {
  //     largest = r;
  //   }
  //   if (largest !== i) {
  //     swap(nums, i, largest); //找到左右节点中大的元素交换
  //     //递归交换后面的节点
  //     maxHeapify(nums, largest, heapSize);
  //   }
  // }
  // function swap(a, i, j) {
  //   //交换函数
  //   let temp = a[i];
  //   a[i] = a[j];
  //   a[j] = temp;
  // }
};

console.log(findKthLargest([3, 1, 2, 4], 2)); // 3
// console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
// console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
// console.log(
//   findKthLargest(
//     [
//       3,
//       2,
//       3,
//       1,
//       2,
//       4,
//       5,
//       5,
//       6,
//       7,
//       7,
//       8,
//       2,
//       3,
//       1,
//       1,
//       1,
//       10,
//       11,
//       5,
//       6,
//       2,
//       4,
//       7,
//       8,
//       5,
//       6,
//     ],
//     20
//   )
// ); // 2
