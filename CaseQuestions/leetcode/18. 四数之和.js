// 给定一个包含 n 个整数的数组 nums 和一个目标值 target，判断 nums 中是否存在四个元素 a，b，c 和 d ，使得 a + b + c + d 的值与 target 相等？找出所有满足条件且不重复的四元组。

// 注意：答案中不可以包含重复的四元组。
var fourSum = function(nums, target) {
  const length = nums.length
  if (length === 0) return []

  nums = nums.sort((a, b) => a - b)
  const res = []

  for (let i = 0; i < length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue

    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break // 确定i索引, 后面的几个值总和大于target 那么后面的值不可能存在等于target的情况
    if (
      nums[i] + nums[length - 3] + nums[length - 2] + nums[length - 1] <
      target
    )
      continue // 确定i索引, 最后的几个值总和小于于target 那么后面的值不可能存在等于target的情况

    for (let j = i + 1; j < length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue

      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break
      if (nums[i] + nums[j] + nums[length - 2] + nums[length - 1] < target)
        continue

      let left = j + 1,
        right = length - 1

      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right]

        if (sum === target) {
          res.push([nums[i], nums[j], nums[left], nums[right]])

          while (left < right && nums[left] === nums[left + 1]) left++
          left++
          while (left < right && nums[right] === nums[right - 1]) right--
          right--
        } else if (sum < target) left++
        else right--
      }
    }
  }

  return res
}

const nums = [1, 0, -1, 0, -2, 2],
  target = 0

const nums1 = [2, 2, 2, 2, 2],
  target1 = 8

console.log(fourSum(nums, target))
console.log(fourSum(nums1, target1))
