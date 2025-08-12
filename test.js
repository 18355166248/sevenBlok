function newFN(func, ...args) {
  const obj = {};
  obj.__proto = func.prototype;
  const result = func.apply(obj, args);
  return result instanceof Object ? result : obj;
}
