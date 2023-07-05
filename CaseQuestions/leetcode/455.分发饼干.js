// 假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。
// 对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
  function numberSort(a, b) {
    return a - b;
  }
  // 先将两个列表进行升序排序
  g = g.sort(numberSort);
  s = s.sort(numberSort);
  // 列表首位的肯定是饼干最小和胃口最小的 先满足小胃口的

  let boyIndex = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= g[boyIndex]) {
      boyIndex++;
    }
  }

  return boyIndex;
};

// 你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
// 虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
// 所以你应该输出1。
console.log(findContentChildren([1, 2, 3], [1, 1])); // 1
// 你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
// 你拥有的饼干数量和尺寸都足以让所有孩子满足。
// 所以你应该输出2.
console.log(findContentChildren([1, 2], [1, 2, 3])); // 2
