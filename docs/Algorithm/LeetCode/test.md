# test

Function.prototype.call2 = function(context) {
  context = context || window;

  context.fn = this;

  var args = Array.prototype.slice.call(arguments, 1);

  var result = eval("context.fn(" + args + ")");

  delete context.fn;

  return result;
};

Function.prototype.apply2 = function(context, args) {
  context = context || window;

  context.fn = this;

  console.log(this);

  var result = eval("context.fn(" + args + ")");

  delete context.fn;

  return result;
};

const obj = { name: "obj" };
const obj2 = { name: "obj2" };

function name1() {
  this.age = 18;
  console.log(this.name, arguments);
}

name1.call(obj, 666);
name1.call2(obj, 666);

name1.apply2(obj2, [888, 999]);
