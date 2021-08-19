var minimumTotal = function(triangle) {
  const memo = Array.from({ length: triangle.length }, (_) =>
    Array(triangle.length).fill()
  )

  return dfs(triangle, 0, 0)

  function dfs(triangle, i, j) {
    if (i === triangle.length) return 0

    if (memo[i][j]) {
      return memo[i][j]
    }

    return (memo[i][j] =
      Math.min(dfs(triangle, i + 1, j), dfs(triangle, i + 1, j + 1)) +
      triangle[i][j])
  }
}
// console.log(minimumTotal([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]))
// console.log(minimumTotal([[-10]]))
// console.log(minimumTotal([[-1], [2, 3], [1, -1, -3]]))
console.log(
  minimumTotal([
    [-1],
    [9, -2],
    [0, 4, 5],
    [7, 4, -4, -5],
    [9, 6, 0, 5, 7],
    [9, 2, -9, -4, 5, -2],
    [-4, -9, -5, -7, -5, -5, -2],
    [-9, 5, -6, -4, 4, 1, 6, -4],
    [-4, 3, 9, -2, 8, 6, -9, -2, -2],
    [7, -6, 9, 8, -4, 2, -4, -2, -1, -2],
    [0, 3, 2, 4, 0, -6, 7, 6, 7, -5, 2],
    [9, 0, -8, 6, 4, 6, 2, 5, -9, 9, -1, -6],
    [6, -3, -4, -5, 0, 3, 3, 4, -6, -4, -7, 7, 3],
  ])
)
