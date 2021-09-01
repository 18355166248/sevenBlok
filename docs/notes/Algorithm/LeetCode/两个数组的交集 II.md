# 两个数组的交集 II

给定两个数组，编写一个函数来计算它们的交集。

## 示例 1：

输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2,2]

## 示例 2:

输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[4,9]

说明：

输出结果中每个元素出现的次数，应与元素在两个数组中出现次数的最小值一致。
我们可以不考虑输出结果的顺序。
进阶：

如果给定的数组已经排好序呢？你将如何优化你的算法？
如果  nums1  的大小比  nums2  小很多，哪种方法更优？
如果  nums2  的元素存储在磁盘上，内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？

## 哈希算法

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
  let k = []

  const obj = nums1.reduce((obj, v) => {
    if (obj[v]) obj[v] += 1
    else obj[v] = 1

    return obj
  }, {})

  nums2.forEach((num) => {
    if (obj[num]) {
      k.push(num)
      obj[num] -= 1
    }
  })

  return k
}
```

执行用时：84 ms, 在所有 JavaScript 提交中击败了 83.24%的用户
内存消耗：39.3 MB, 在所有 JavaScript 提交中击败了 75.23%的用户

## 排序+双指针

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
  // 先排序
  nums1 = nums1.sort((a, b) => a - b)
  nums2 = nums2.sort((a, b) => a - b)

  let k1 = 0,
    k2 = 0,
    arr = []

  const l = nums1.length > nums2.length ? nums1.length : nums2.length

  while (k1 < l && k2 < l) {
    const n1 = nums1[k1],
      n2 = nums2[k2]
    if (n1 === n2) {
      arr.push(n1)
      k1++
      k2++
    } else if (n1 > n2) {
      k2++
    } else if (n1 < n2) {
      k1++
    }
  }

  return arr
}
```

执行用时：88 ms, 在所有 JavaScript 提交中击败了 68.79%的用户
内存消耗：39.5 MB, 在所有 JavaScript 提交中击败了 60.48%的用户
