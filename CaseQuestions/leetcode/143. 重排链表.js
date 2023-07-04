var reorderList = function(head) {
  if (head === null) return null;
  const prevHead = { next: head };

  const arr = [];

  while (head) {
    arr.push(head);
    head = head.next;
  }
  head = prevHead.next;
  const n = arr.length - 1;

  const nums = [];
  const is = n % 2;
  const mid = is ? Math.floor(n / 2) : Math.floor(n / 2) - 1;

  for (let i = 0; i <= mid; i++) {
    nums.push(arr[i]);
    nums.push(arr[n - i]);
    if (!is && i === mid) {
      nums.push(arr[mid + 1]);
    }
  }

  for (let i = 1; i < nums.length; i++) {
    head.next = nums[i];
    head = head.next;
  }
  head.next = null;
  console.log(JSON.stringify(prevHead.next));
};
console.log(
  reorderList({
    val: 1,
    next: {
      val: 2,
      next: {
        val: 3,
        next: {
          val: 4,
          next: null,
        },
      },
    },
  })
);
console.log(
  reorderList({
    val: 1,
    next: {
      val: 2,
      next: {
        val: 3,
        next: {
          val: 4,
          next: {
            val: 5,
            next: null,
          },
        },
      },
    },
  })
);
console.log(
  reorderList({
    val: 1,
    next: null,
  })
);
