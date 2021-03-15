Function.prototype.bind2 = function(context) {
  const self = this;
  const args = Array.prototype.slice.call(arguments, 1);

  const fn = function() {};

  const returnFn = function() {
    const bindArgs = Array.prototype.slice.call(arguments, 1);

    console.log("this instanceof fn", this instanceof fn);

    // 当返回函数作文构造函数的时候, this指向的实例, 结果返回true, 将绑定函数的this指向该实例
    // 可以让实例获得来自绑定函数的值
    return self.apply(
      this instanceof returnFn ? this : context,
      args.concat(bindArgs)
    );
  };

  // fn.prototype = this.prototype;
  // returnFn.prototype = new fn();

  // returnFn.prototype = this.prototype;
  fn.prototype = Object.create(this.prototype);

  return returnFn;
};

const obj = { name: 11 };

function bb() {
  console.log(this.name, "log");
}

const bb1 = bb.bind2(obj, 123, 456);

bb1.prototype.value = 1;

console.log(bb1.prototype.value);
console.log(bb.prototype.value);
