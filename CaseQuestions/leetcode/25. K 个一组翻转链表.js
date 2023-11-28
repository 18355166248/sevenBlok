// 给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。
// k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。
// 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
// 提示：
// 链表中的节点数目为 n
// 1 <= k <= n <= 5000
// 0 <= Node.val <= 1000
// 进阶：你可以设计一个只用 O(1) 额外内存空间的算法解决此问题吗？

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
  const dummy = new ListNode();
  dummy.next = head;
  let [start, end] = [dummy, dummy.next];
  let count = 0;
  while (end) {
    count++;
    if (count % k === 0) {
      console.log(end, count);
      start = reverse(start, end.next);
      end = start.next;
      console.log(11, start.next);
    } else {
      // 每次取下一个节点
      end = end.next;
    }
  }
  return dummy.next;
};

function reverse(start, end) {
  let [prev, cur] = [start, start.next];
  let first = cur;
  while (cur !== end) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  //  假设456正在反转，此时为 3>2>1>4>5>6>7,一组内数据翻转完成后为：3>2>1>4<5<6>7 (注意箭头方向)， 此时需要将一个小组两侧对外的连接重置下； start.next = prev 前一个翻转组的最后一个节点指向当前刚翻转完一组的结尾，即将 1 指向 6 ； first.next = curr 当前组的第一个节点指向下一将要翻转组的第一个节点，即将 4 指向 7 ；
  start.next = prev;
  first.next = cur;
  return first;
}

const line = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: {
          value: 5,
          next: null,
        },
      },
    },
  },
};

console.log(JSON.stringify(reverseKGroup(line, 2)));
// console.log(reverseList(line, line.next.next.next));
