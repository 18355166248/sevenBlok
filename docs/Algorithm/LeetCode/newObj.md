# newObj

function objectFactory() {
  const obj = new Object(),
    Constructor = Array.prototype.shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  const ret = Constructor.apply(obj, arguments);

  return typeof ret === "object" ? ret : obj;
}

function name() {
  this.age = 12;

  return this.age;
}

const nn = objectFactory(name);

nn.age = 33333;
console.log(nn);
