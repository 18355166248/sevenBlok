const Bar = (function() {
  let id = 0;

  return function() {
    if (!new.target) {
      throw new Error("plese use new");
    }

    this.id = ++id;
  };
})();

console.log(new Bar(123));
console.log(new Bar(123));
console.log(new Bar(123));
console.log(Bar(123));
