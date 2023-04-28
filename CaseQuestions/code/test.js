class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class LRUCache {
  constructor(max) {
    this.max = max; // 最大长度
    this.hash = {}; // 映射
    this.length = 0; // 长度
    this.head = new ListNode(); // 头部
    this.foot = new ListNode(); // 尾部
    this.head.next = this.foot;
    this.head.prev = this.head;
  }
  put(key, value) {
    const node = this.hash[key];

    if (node) {
      // 已经存在 删除原先的 更新到头部
      this.removeFromList(node);
      node.value = value;
      this.addHead(node);
    } else {
      if (this.length === this.max) {
        // 存储满了
        // 先删除最远一次使用的
        this.removeFoot();
      }
      // 新增
      const newNode = new ListNode(key, value);
      this.addHead(newNode);
      this.hash[key] = newNode;
      this.length++;
    }
  }

  addHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node; // 之前头部的上一个变成第二个了 上一个指向新的头 node
    this.head.next = node;
  }

  removeFoot() {
    const footNode = this.foot.prev;
    this.length--;
    Reflect.deleteProperty(this.hash, footNode.key);
    this.removeFromList(footNode);
    return footNode;
  }

  get(key) {
    const node = Reflect.get(this.hash, key);
    if (node) {
      // 存在的话 移动到顶部
      this.moveToHead(node);
      return node.value;
    } else {
      return -1;
    }
  }

  moveToHead(node) {
    this.removeFromList(node);
    this.addHead(node);
  }
  removeFromList(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
  }
}

lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1); // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.put(1, 11); // 该操作会使得关键字 2 作废，缓存是 {1=11, 3=3}
console.log(lRUCache.get(2)); // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 3 作废，缓存是 {4=4, 1=11}
console.log(lRUCache.get(1)); // 返回 11 (未找到)
console.log(lRUCache.get(3)); // 返回 -1
console.log(lRUCache.get(4)); // 返回 4

console.log(lRUCache.head);
