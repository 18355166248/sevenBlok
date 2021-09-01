# trime

String.prototype.trim2 = function() {
  var str = this;
  str = str.replace(/^\s\s*/, "");
  var ws = /\s/;
  var i = str.length;

  while (ws.test(str.charAt(--i)));

  return str.slice(0, i + 1);
};

const a = "  23234   ";

console.log(a.trim2(), 1);
