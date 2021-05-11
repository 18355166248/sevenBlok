// 1.
var name = "window";
var bar = { name: "bar" };

var foo = {
  name: "foo",
  say: function() {
    // console.log(this);
    console.log(this.name);
  },
  say1: () => console.log(this.name),
  say2: function() {
    return () => {
      console.log(this.name);
    };
  },
};

foo.say(); // foo
foo.say.call(bar); // bar
foo.say1(); // window
foo.say1.call(bar); // window
foo.say2()(); // foo
foo.say2.call(bar)(); // bar
foo.say2().call(bar); // foo

class Nww {
  a() {
    console.log(this);
  }
  b = () => {
    console.log(this);
  };
}

const n = new Nww();
console.log(n.a(), n.b());

// 2.
inner = "window";

function say() {
  console.log(inner);
  console.log(this.inner);
}

var obj1 = (function() {
  var inner = "1-1";
  return {
    inner: "1-2",
    say: function() {
      console.log(inner);
      console.log(this.inner);
    },
  };
})();

var obj2 = (function() {
  var inner = "2-1";
  return {
    inner: "2-2",
    say: function() {
      console.log(inner);
      console.log(this.inner);
    },
  };
})();

say(); // window window
obj1.say(); // 1-1 1-2
obj2.say(); // 2-1 2-2
obj1.say = say;
obj1.say(); // window 1-2
obj1.say = obj2.say;
obj1.say(); // 2-1 1-2

// person1.show1(); person1
// person1.show1.call(person2); person2

// person1.show2(); window
// person1.show2.call(person2); window

// person1.show3()(); window
// person1.show3().call(person2); person2
// person1.show3.call(person2)(); window

// person1.show4()(); person1 person1

// person1.show4().call(person2); person1 person1
// person1.show4.call(person2)(); person2 person2
