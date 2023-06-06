class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(max) {
    this.max = max;
    this.hash = {}; // 缓存每个映射
    this.head = new ListNode();
    this.foot = new ListNode();
    this.count = 0; // 计数
    this.head.next = this.foot;
    this.foot.prev = this.head;
  }
  put(key, value) {
    const node = this.hash[key];
    if (node) {
      // 已存在 更新并置顶
      node.value = value;
      this.moveHead(node);
    } else {
      // 不存在 新增置顶
      if (this.count === this.max) {
        // 存储满了 删除最远的一次
        this.removeListFoot();
      }

      const newNode = new ListNode(key, value);
      this.hash[key] = newNode;
      this.addHead(newNode);
      this.count++;
    }
  }
  addHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  moveHead(node) {
    this.removeNode(node);
    this.addHead(node);
  }
  removeNode(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
  }
  get(key) {
    const node = this.hash[key];
    if (node) {
      this.moveHead(node);
      return node.value;
    }

    return node;
  }
  removeListFoot() {
    const deleteData = this.popFoot();
    Reflect.deleteProperty(this.hash, deleteData.key);
    this.count--;
  }
  popFoot() {
    const prev = this.foot.prev;
    this.removeNode(prev);
    return prev;
  }
}

lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
console.log(lRUCache.get(1)); // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {3=3, 1=1}
lRUCache.put(1, 11); // 该操作会使得关键字 2 作废，缓存是 {1=11, 3=3}
console.log(lRUCache.get(2)); // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 3 作废，缓存是 {4=4, 1=11}
console.log(lRUCache.get(1)); // 返回 11 (未找到)
console.log(lRUCache.get(3)); // 返回 -1
console.log(lRUCache.get(4)); // 返回 4

console.log(lRUCache.head);

var ListNode = function(key, value) {
  this.key = key;
  this.value = value;
  this.prev = null;
  this.next = null;
};

/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.max = capacity;
  this.cache = {};
  this.head = new ListNode();
  this.foot = new ListNode();
  this.count = 0;
  this.head.next = this.foot;
  this.foot.prev = this.head;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  const node = this.cache[key];
  if (!node) return -1;

  // 删除node 并将删除node置顶
  this.moveHead(node);
  return node.value;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */

LRUCache.prototype.put = function(key, value) {
  const node = Reflect.get(this.cache, key);
  if (node) {
    node.value = value;
    this.moveHead(node);
  } else {
    if (this.count === this.max) {
      this.removeFoot();
    }

    const newNode = new ListNode(key, value);
    this.addHead(newNode);
    this.count++;
    Reflect.set(this.cache, key, newNode);
  }
};
LRUCache.prototype.moveHead = function(node) {
  this.removeNode(node);
  this.addHead(node);
};

// 新增到顶部
LRUCache.prototype.addHead = function(node) {
  node.prev = this.head;
  node.next = this.head.next;
  this.head.next.prev = node;
  this.head.next = node;
};

// 删除最远的一次
LRUCache.prototype.removeFoot = function() {
  const footPrev = this.foot.prev;
  this.removeNode(footPrev);
  this.count--;
  Reflect.deleteProperty(this.cache, footPrev.key);
};
// 删除节点
LRUCache.prototype.removeNode = function(node) {
  const next = node.next;
  const prev = node.prev;
  prev.next = next;
  next.prev = prev;
};
/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

const lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {2=2, 1=1}
console.log(lRUCache.get(1)); // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {3=3, 1=1}
lRUCache.put(1, 11); // 该操作会使得关键字 2 作废，缓存是 {1=11, 3=3}
console.log(lRUCache.get(2)); // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 3 作废，缓存是 {4=4, 1=11}
console.log(lRUCache.get(1)); // 返回 11
console.log(lRUCache.get(3)); // 返回 -1
console.log(lRUCache.get(4)); // 返回 4

console.log(lRUCache.head);
