var sortedListToBST = function(head) {
  const arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }

  function dfs(treeArr, left, right) {
    if (left > right) return;

    const mid = left + right + 1
  }

  dfs(arr, 0, arr.length - 1);
};
console.log(
  sortedListToBST({
    val: -10,
    next: {
      val: -3,
      next: {
        val: 0,
        next: {
          val: 5,
          next: {
            val: 9,
          },
        },
      },
    },
  })
);
