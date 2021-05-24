class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}
/*
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.max = capacity; // 缓存最大数目
  this.hash = {}; // 哈希表
  this.count = 0; // 缓存数目
  this.dummyHead = new ListNode(); // 虚拟头结点
  this.dummyTail = new ListNode(); // 虚拟尾结点
  this.dummyHead.next = this.dummyTail;
  this.dummyTail.prev = this.dummyHead;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  let node = this.hash[key];
  if (!node) return -1;
  this.moveToHead(node);
  return node.value;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  let node = this.hash[key];

  // 不存在
  if (!node) {
    if (this.count === this.max) {
      // 存储满了, 删除最远一次使用的数据
      this.removeLRUItem();
    }
    const newNode = new ListNode(key, value);
    this.hash[key] = newNode;
    this.addToHead(newNode);
    this.count++;
  } else {
    node.value = value; // 存在 更新value
    this.moveToHead(node); // 将数据更新到头部
  }
};

LRUCache.prototype.moveToHead = function(node) {
  this.removeFromList(node);
  this.addToHead(node);
};
LRUCache.prototype.removeFromList = function(node) {
  const prev = node.prev;
  const next = node.next;
  prev.next = node.next;
  next.prev = prev;
};
LRUCache.prototype.addToHead = function(node) {
  node.prev = this.dummyHead;
  node.next = this.dummyHead.next;
  this.dummyHead.next.prev = node; // 原来真实头节点的prev指向node
  this.dummyHead.next = node;
};
LRUCache.prototype.removeLRUItem = function() {
  const tail = this.popTail();
  delete this.hash[tail.key];
  this.count--;
};
LRUCache.prototype.popTail = function() {
  const tail = this.dummyTail.prev;
  this.removeFromList(tail);
  return tail;
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
