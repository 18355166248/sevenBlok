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
