var solve = function(board) {
  const xLen = board.length
  if (xLen === 0) return
  const yLen = board[0].length

  for (let i = 0; i < xLen; i++) {
    dfs(board, i, 0)
    dfs(board, i, yLen - 1)
  }

  for (let i = 1; i < yLen - 1; i++) {
    dfs(board, 0, i)
    dfs(board, xLen - 1, i)
  }

  for (let i = 0; i < xLen; i++) {
    for (let j = 0; j < yLen; j++) {
      if (board[i][j] === 'A') {
        board[i][j] = 'O'
      } else if (board[i][j] === 'O') {
        board[i][j] = 'X'
      }
    }
  }

  // console.log(board)

  function dfs(board, x, y) {
    if (x < 0 || y < 0 || x >= xLen || y >= yLen || board[x][y] !== 'O') return

    board[x][y] = 'A'
    dfs(board, x + 1, y)
    dfs(board, x - 1, y)
    dfs(board, x, y + 1)
    dfs(board, x, y - 1)
  }
}
// console.log(
//   solve([
//     ['X', 'X', 'X', 'X'],
//     ['X', 'O', 'O', 'X'],
//     ['X', 'X', 'O', 'X'],
//     ['X', 'O', 'X', 'X'],
//   ])
// )

// console.log(
//   solve([
//     ['X', 'O', 'X', 'O', 'X', 'O'],
//     ['O', 'X', 'O', 'X', 'O', 'X'],
//     ['X', 'O', 'X', 'O', 'X', 'O'],
//     ['O', 'X', 'O', 'X', 'O', 'X'],
//   ])
// )

console.log(
  solve([
    ['X', 'O', 'X', 'O', 'X', 'O'],
    ['O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O'],
    ['O', 'X', 'O', 'X', 'O', 'X'],
  ])
)
