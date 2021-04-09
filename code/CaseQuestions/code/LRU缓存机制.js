/*
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.line = { value: "head", next: { value: "foot", next: null } };
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  let line = this.line.next;
  while (line) {
    if (line.key === key) {
      const ll = this.line.next;

      return line.value;
    }

    line = line.next;
  }

  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  const line = { key, value, next: this.line.next };

  this.line.next = line;
  console.log(JSON.stringify(this.line));
};

var obj = new LRUCache(2);
obj.put(1, 1);
obj.put(2, 2);
console.log(obj.get(2));
console.log(obj.get(3));
// obj.put(1, 1);
// obj.put(4, 1);
// console.log(obj.get(2));

// var obj2 = new LRUCache(1);
// obj2.put(2, 1);
// console.log(obj2.get(1));
