# js 词法编译器

>> 代码来源于 插件 [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)

>> 版权声明：本文为 CSDN 博主「编程---」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
>> 原文链接：https://blog.csdn.net/ssyyjj88/article/details/80347471

这个编译器只能把 (add 2 (substract 4 2)) 编译成 add(2, subtract(4, 2));

## 前言

Compiler 是在做什么的，

Compiler 的工作是将「来源代码」转成「目标语言」。
除了我们熟知的 gcc 之外，还有 Babel，
没错，我们的生活周遭充满了 compiler，
就算是写 JavaScript，
如果要使用 es6 以上的语法，
你就必须得用到 Babel 这个 compiler。
将你写的 code(来源代码)转成现在浏览器上跑得动的 JavaScript（目标代码）。

## 一. 一些准备知识

AST （抽象语法树），或简称语法树，是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节。比如，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；而类似于 if-condition-then 这样的条件跳转语句，可以使用带有两个分支的节点来表示。

## 二. 三个步骤

做出一个 compiler，

基本上只需要三步就完成了：

Parsing：将 code 转成抽象化的树状格式，方便转化。

Trasformation：将 Abastract syntax tree（之后会讲到）转化成好生成 code 的形式

Code Generation：产生目标的代码，这里是 JavaScript

## 三. 目标

开始之前，先定义一下我们要完成什么事情。

我们要将：

( add 22 ( subtract 43 2 ))
Compile 成：

add( 22 , subtract( 43 , 2 ))
就是这样而已。应该没有很难吧？

综合一下前面讲的，我们要写的 compiler 会长这个样子：

```js
function compiler(input) {
  var tokens = lexer(input);
  var ast = parser(tokens);
  var nextAst = transformer(ast);
  var output = codeGenerator(nextAst);
  return output;
}
```

## 四. 原理详解

### 编译器过程

大多数编译器可以分成三个阶段：解析（Parsing 或称 lexer），转换（Transformation）以及代码生成（Code Generation）

1. 会将 raw code 先切成一块一块后，再根据这些小块的语义来建立一个 Abstract Syntax Tree（以下简称 AST）。

2. 转换将对这个抽象的表示做一些处理，让它能做到编译器期望它做到的事情。

3. 代码生成接收处理之后的代码表示，然后把它转换成新的代码。

### 解析

#### 两个阶段：词法分析（Lexical Analysis）和语法分析（Syntactic Analysis）。

1. 词法分析 就是分词啦！把 code 切成一块块的 tokens。这个过程是在词法分析器（Tokenizer 或者 Lexer）中完成的。Token 是一个数组，由一些代码语句的碎片组成。它们可以是数字、标签、标点符号、运算符，或者其它任何东西。

2. 语法分析 将上一个步骤的 tokens 转成 AST。

比如说对于下面这一行代码语句： (add 2 (subtract 4 2))  它产生的 Token 看起来或许是这样的：

```js
[
  { type: "paren", value: "(" },
  { type: "name", value: "add" },
  { type: "number", value: "2" },
  { type: "paren", value: "(" },
  { type: "name", value: "subtract" },
  { type: "number", value: "4" },
  { type: "number", value: "2" },
  { type: "paren", value: ")" },
  { type: "paren", value: ")" }
];
```

它的抽象语法树（AST）看起来或许是这样的：

```js
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
}
```

转换（Transformation）这一阶段的目标是要将 AST 转成专为生成 JavaScript 而生的 nextAST   我们的 AST 中有很多相似的元素，这些元素都有 type 属性，它们被称为 AST  结点。这些结点含有若干属性，可以用于描述 AST 的部分信息。   比如下面是一个“NumberLiteral”结点：

```js
 { type: 'NumberLiteral', value: '2' } 
```

又比如下面是一个“CallExpression”结点：

```js
{     
  type: 'CallExpression',     
  name: 'subtract',     
  params: [...nested nodes go here...] 
}
```

### 遍历（Traversal）

这里要分成两个函数来实作：

Traverser：去遍历我们前面造出来的 AST，并执行我们想要执行在每个节点上的 function

Transformer：利用前面做出来的 Traverser 转化成专为 JavaScript 而生的  nextAst

为了更清楚知道我们在做什么，先看一下 transform 的结果：

```js
{
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'add'
      },
      arguments: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }
  }]
}
```

1. Traverser 为了要遍历我们的 AST，

我们要先写一个 helper function 来 traverse 每一个 token 的节点。

以下一样把 traverser 分成两部分来看，

现在先只要专注在最上方的 traverseArray 就行了：

traverseArray 会做的事情就是对每个子节点执行 traverseNode。

```js
function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(function(child) {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node, parent) {
    // to be continued
  }
  traverseNode(ast, null);
}
```

<!-- theme="#DCF2FD" font-size="16px" color="#618ca0" -->

<card-primary>
  <p>
      traverser 里面的 visitor，
    面放着我们「拜访」每个节点时要执行的方法，
    Transform 的工作就是由 visitor 完成的，这里先不要急，
    到 transform 这个函数时就会看到 visitor 是如何作用的。
    首先我们根据子节点的 type 呼叫对应执行的 method，
    找到的话执行它，待会一再对子节点要执行的就是这一部份：
  </p>
</card-primary>

```js
function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(function(child) {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node, parent) {
    var method = visitor[node.type];
    if (method) {
      method(node, parent);
    }
    // to be continued
  }
  traverseNode(ast, null);
}
```

接着再根据子节点的 type，去执行 traverseArray，

Program 的子节点是 body，

CallExpression 的事 params，

而单纯的 NumberLiteral 则没有子节点需要被遍历。

```js
function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(function(child) {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node, parent) {
    var method = visitor[node.type];
    if (method) {
      method(node, parent);
    }
    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
        break;
      default:
        throw new TypeError(node.type);
    }
  }
  traverseNode(ast, null);
}
```

2. Transformer 再来则是重头戏：transformer，

transformer 是个相当 powerful 的概念，

将我们一路 parse 过来的东西，转成跟目标语言非常相近的 AST。

首先先造出一个新的 nextAst：

```js
function transformer(ast) {
  // init
  var nextAst = {
    type: "Program",
    body: []
  };
  // To be continued
}
```

再来这里是有点 tricky 的部份，

我们对 ast 底下增加了一个隐藏的属性：\_context，

下面我们对子节点的操作也会常常用到这个非常 naive 的方法。

其实只是在名字前面加上底线，并不是真正的隐藏

再来则是前面有提的的 visitor，

这里就能够看出为什么选择 Lisp 了，

语法非常的简单且直观，

但 transformer 仍然是一个相较之下较为复杂的函数：

```js
function transformer(ast) {
  var nextAst = {
    type: "Program",
    body: []
  };
  ast._context = nextAst.body;
  var visitor = {
    NumberLiteral: function(node, parent) {
      parent._context.push({
        type: "NumberLiteral",
        value: node.value
      });
    },
    CallExpression: function(node, parent) {
      // to be continued
    }
  };
  traverser(ast, visitor);
}
```

NumberLiteral  这个 method，做的事情并不难，

只是 push 一个节点到父节点的\_context 中而已。

假如今天我们的程式什么都没有，只有一个单纯的数字：

<card-primary>2</card-primary>
那 transfomer 会造出来的 nextAst 就是这样

<card-primary>
<p>"{
type: 'Program'
body: [{type: 'NumberLiteral' , value: '2' }]
}"</p>
</card-primary>

跟前面的 ast 几乎是没有差的。

接着看如果遇到 function call 时要怎么做，

为了简洁我省略了其他部分的 code。

我们同样先造出一个 expression 的 object，

包含一个 callee 属性。

callee 就是被呼叫的 function

(add 2 3)中，被呼叫的就是 add 这个 expression

再来同样在这个节点建立一个\_context，

并将其指到我们刚刚刚创造的 expression，

以下是 CallExpression 这个 method 的上半部：

```js
function transformer(ast) {
  // pass
  var visitor = {
    // pass
    CallExpression: function(node, parent) {
      var expression = {
        type: "CallExpression",
        callee: {
          type: "Itentifier",
          name: node.name
        },
        arguments: []
      };
      node.\_context = expression.arguments;
      // pass
    }
  };
  traverser(ast, visitor);
}
```

再来则是跟 JavaScript 比较相关的部份，

因为 JavaScript 最上层的 Call Expression 其实是 statement，

所以在确定该个 expression 的父节点 type 不是 CallExpression 时，

要再多加一层 ExpressionStatement。

Statement 就是叙述句，像是 var i = 0；

Expression 则是会产生值的，像是 yo()。

但你知道的，有些 Statement 的地方我们仍然可以产生值，

因此也就有了 Expression Statement 的存在。

如此概括是有点草率，不过这里还是将重点放在我们的 Compiler 上。

关于 Expression 和 Statement 在下方补充资料有放上一篇我觉得既短小又很不错的文章！

```js
function transformer(ast) {
  // pass
  var visitor = {
    // pass
    CallExpression: function(node, parent) {
      var expression = {
        type: "CallExpression",
        callee: {
          type: "Itentifier",
          name: node.name
        },
        arguments: []
      };
      node.\_context = expression.arguments;
      if (parent.type !== "CallExpression") {
        expression = {
          type: "ExpressionStatement",
          expression: expression
        };
      }
      parent.\_context.push(expression);
    }
  };
  traverser(ast, visitor);
}
```

于是我们就完成了 transformer 了！

下一阶段就是根据这个 nextAst 来生成 code 了。

代码生成（Code Generation） 
终于到最后啦！

其实有了前一段专为 JavaScript 生成的 nextAst 之后，

要生成 JavaScript 真的是毫不费力。

直接来看 codeGenerator 这个函数，

Program: 用换行来区分各个小 Program。

Expression:再来是在每个 Expression 后面加上;。

CallExpression:

callee  就是被呼叫的函数，
arguments  则会被逗号分开来，如果 argument 是 expression 的话会继续递回的呼叫  codeGenerator
Identifier: expression （函数）的的名称。

NumberLiteral: 毫无反应，就是个数字。

最后则是不包含以上 type 的 node，就会丢出 type error。真的是非常 robust。

```js
function codeGenerator(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGenerator).join("\n");
    case "ExpressionStatement":
      return codeGenerator(node.expression) + ";";
    case "CallExpression":
      return (
        codeGenerator(node.callee) +
        "(" +
        node.arguments.map(codeGenerator).join(", ") +
        ")"
      );
    case "Identifier":
      return node.name;
    case "NumberLiteral":
      return node.value;
    default:
      throw new TypeError(node.type);
  }
}
```

## 五. 测试用例

```js
const {
  tokenizer,
  parser,
  transformer,
  codeGenerator,
  compiler
} = require("./the-super-tiny-compiler");
const assert = require("assert");

const input = "(add 2 (subtract 4 2))";
const output = "add(2, subtract(4, 2));";

const tokens = [
  { type: "paren", value: "(" },
  { type: "name", value: "add" },
  { type: "number", value: "2" },
  { type: "paren", value: "(" },
  { type: "name", value: "subtract" },
  { type: "number", value: "4" },
  { type: "number", value: "2" },
  { type: "paren", value: ")" },
  { type: "paren", value: ")" }
];

const ast = {
  type: "Program",
  body: [
    {
      type: "CallExpression",
      name: "add",
      params: [
        {
          type: "NumberLiteral",
          value: "2"
        },
        {
          type: "CallExpression",
          name: "subtract",
          params: [
            {
              type: "NumberLiteral",
              value: "4"
            },
            {
              type: "NumberLiteral",
              value: "2"
            }
          ]
        }
      ]
    }
  ]
};

const newAst = {
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "add"
        },
        arguments: [
          {
            type: "NumberLiteral",
            value: "2"
          },
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "subtract"
            },
            arguments: [
              {
                type: "NumberLiteral",
                value: "4"
              },
              {
                type: "NumberLiteral",
                value: "2"
              }
            ]
          }
        ]
      }
    }
  ]
};

assert.deepStrictEqual(
  tokenizer(input),
  tokens,
  "Tokenizer should turn `input` string into `tokens` array"
);
assert.deepStrictEqual(
  parser(tokens),
  ast,
  "Parser should turn `tokens` array into `ast`"
);
assert.deepStrictEqual(
  transformer(ast),
  newAst,
  "Transformer should turn `ast` into a `newAst`"
);
assert.deepStrictEqual(
  codeGenerator(newAst),
  output,
  "Code Generator should turn `newAst` into `output` string"
);
assert.deepStrictEqual(
  compiler(input),
  output,
  "Compiler should turn `input` into `output`"
);

console.log("All Passed!");
```

## 六. 代码实操

```js
/**
 * ============================================================================
 *                            词法分析器（Tokenizer）!
 * ============================================================================
 */

// 我们从接收一个字符串开始，首先设置两个变量。
function tokenizer(input) {
  // `current`变量类似指针，用于记录我们在代码字符串中的位置。
  var current = 0;

  // `tokens`数组是我们放置 token 的地方
  var tokens = [];

  // 首先我们创建一个 `while` 循环， `current` 变量会在循环中自增=。
  //
  // 我们这么做的原因是，由于 token 数组的长度是任意的，所以可能要在单个循环中多次
  // 增加 `current`
  while (current < input.length) {
    // 我们在这里储存了 `input` 中的当前字符
    var char = input[current];

    // 要做的第一件事情就是检查是不是右圆括号。这在之后将会用在 `CallExpressions` 中，
    // 但是现在我们关心的只是字符本身。
    //
    // 检查一下是不是一个左圆括号。
    if (char === "(") {
      // 如果是，那么我们 push 一个 type 为 `paren`，value 为左圆括号的对象。
      tokens.push({
        type: "paren",
        value: "("
      });

      // 自增 `current`
      current++;

      // 结束本次循环，进入下一次循环
      continue;
    }

    // 然后我们检查是不是一个右圆括号。这里做的时候和之前一样：检查右圆括号、加入新的 token、
    // 自增 `current`，然后进入下一次循环。
    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")"
      });
      current++;
      continue;
    }

    // 继续，我们现在检查是不是空格。有趣的是，我们想要空格的本意是分隔字符，但这现在
    // 对于我们储存 token 来说不那么重要。我们暂且搁置它。
    //
    // 所以我们只是简单地检查是不是空格，如果是，那么我们直接进入下一个循环。
    var WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // 下一个 token 的类型是数字。它和之前的 token 不同，因为数字可以由多个数字字符组成，
    // 但是我们只能把它们识别为一个 token。
    //
    //   (add 123 456)
    //        ^^^ ^^^
    //        Only two separate tokens
    //        这里只有两个 token
    //
    // 当我们遇到一个数字字符时，将会从这里开始。
    var NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      // 创建一个 `value` 字符串，用于 push 字符。
      var value = "";

      // 然后我们循环遍历接下来的字符，直到我们遇到的字符不再是数字字符为止，把遇到的每
      // 一个数字字符 push 进 `value` 中，然后自增 `current`。
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 然后我们把类型为 `number` 的 token 放入 `tokens` 数组中。
      tokens.push({
        type: "number",
        value: value
      });

      // 进入下一次循环。
      continue;
    }

    // 最后一种类型的 token 是 `name`。它由一系列的字母组成，这在我们的 lisp 语法中
    // 代表了函数。
    //
    //   (add 2 4)
    //    ^^^
    //    Name token
    //
    var LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      var value = "";

      // 同样，我们用一个循环遍历所有的字母，把它们存入 value 中。
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 然后添加一个类型为 `name` 的 token，然后进入下一次循环。
      tokens.push({
        type: "name",
        value: value
      });

      continue;
    }

    // 最后如果我们没有匹配上任何类型的 token，那么我们抛出一个错误。
    throw new TypeError("I dont know what this character is: " + char);
  }

  // 词法分析器的最后我们返回 tokens 数组。
  return tokens;
}

/**
 * ============================================================================
 *                             语法分析器（Parser）!!!
 * ============================================================================
 */

/**
 *  语法分析器接受 token 数组，然后把它转化为 AST
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

// 现在我们定义 parser 函数，接受 `tokens` 数组
function parser(tokens) {
  // 我们再次声明一个 `current` 变量作为指针。
  var current = 0;

  // 但是这次我们使用递归而不是 `while` 循环，所以我们定义一个 `walk` 函数。
  function walk() {
    // walk函数里，我们从当前token开始
    var token = tokens[current];

    // 对于不同类型的结点，对应的处理方法也不同，我们从 `number` 类型的 token 开始。
    // 检查是不是 `number` 类型
    if (token.type === "number") {
      // 如果是，`current` 自增。
      current++;

      // 然后我们会返回一个新的 AST 结点 `NumberLiteral`，并且把它的值设为 token 的值。
      return {
        type: "NumberLiteral",
        value: token.value
      };
    }

    // 接下来我们检查是不是 CallExpressions 类型，我们从左圆括号开始。
    if (token.type === "paren" && token.value === "(") {
      // 我们会自增 `current` 来跳过这个括号，因为括号在 AST 中是不重要的。
      token = tokens[++current];

      // 我们创建一个类型为 `CallExpression` 的根节点，然后把它的 name 属性设置为当前
      // token 的值，因为紧跟在左圆括号后面的 token 一定是调用的函数的名字。
      var node = {
        type: "CallExpression",
        name: token.value,
        params: []
      };

      // 我们再次自增 `current` 变量，跳过当前的 token
      token = tokens[++current];

      // 现在我们循环遍历接下来的每一个 token，直到我们遇到右圆括号，这些 token 将会
      // 是 `CallExpression` 的 `params`（参数）
      //
      // 这也是递归开始的地方，我们采用递归的方式来解决问题，而不是去尝试解析一个可能有无限
      // 层嵌套的结点。
      //
      // 为了更好地解释，我们来看看我们的 Lisp 代码。你会注意到 `add` 函数的参数有两个，
      // 一个是数字，另一个是一个嵌套的 `CallExpression`，这个 `CallExpression` 中
      // 包含了它自己的参数（两个数字）
      //
      //   (add 2 (subtract 4 2))
      //
      // 你也会注意到我们的 token 数组中有多个右圆括号。
      //
      //   [
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'add'      },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'subtract' },
      //     { type: 'number', value: '4'        },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: ')'        }, <<< 右圆括号
      //     { type: 'paren',  value: ')'        }  <<< 右圆括号
      //   ]
      //
      // 遇到嵌套的 `CallExpressions` 时，我们将会依赖嵌套的 `walk` 函数来
      // 增加 `current` 变量
      //
      // 所以我们创建一个 `while` 循环，直到遇到类型为 `'paren'`，值为右圆括号的 token。
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        // 我们调用 `walk` 函数，它将会返回一个结点，然后我们把这个节点
        // 放入 `node.params` 中。
        node.params.push(walk());
        token = tokens[current];
      }

      // 我们最后一次增加 `current`，跳过右圆括号。
      current++;

      // 返回结点。
      return node;
    }

    // 同样，如果我们遇到了一个类型未知的结点，就抛出一个错误。
    throw new TypeError(token.type);
  }

  // 现在，我们创建 AST，根结点是一个类型为 `Program` 的结点。
  var ast = {
    type: "Program",
    body: []
  };

  // 现在我们开始 `walk` 函数，把结点放入 `ast.body` 中。
  //
  // 之所以在一个循环中处理，是因为我们的程序可能在 `CallExpressions` 后面包含连续的两个
  // 参数，而不是嵌套的。
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // 最后我们的语法分析器返回 AST
  return ast;
}

/**
 * ============================================================================
 *                                   遍历器!!!
 * ============================================================================
 */

/**
 * 现在我们有了 AST，我们需要一个 visitor 去遍历所有的结点。当遇到某个类型的结点时，我们
 * 需要调用 visitor 中对应类型的处理函数。
 *
 *   traverse(ast, {
 *     Program(node, parent) {
 *       // ...
 *     },
 *
 *     CallExpression(node, parent) {
 *       // ...
 *     },
 *
 *     NumberLiteral(node, parent) {
 *       // ...
 *     }
 *   });
 */

// 所以我们定义一个遍历器，它有两个参数，AST 和 vistor。在它的里面我们又定义了两个函数...
function traverser(ast, visitor) {
  // `traverseArray` 函数允许我们对数组中的每一个元素调用 `traverseNode` 函数。
  function traverseArray(array, parent) {
    array.forEach(function(child) {
      traverseNode(child, parent);
    });
  }

  // `traverseNode` 函数接受一个 `node` 和它的父结点 `parent` 作为参数，这个结点会被
  // 传入到 visitor 中相应的处理函数那里。
  function traverseNode(node, parent) {
    // 首先我们看看 visitor 中有没有对应 `type` 的处理函数。
    var method = visitor[node.type];

    // 如果有，那么我们把 `node` 和 `parent` 都传入其中。
    if (method) {
      method(node, parent);
    }

    // 下面我们对每一个不同类型的结点分开处理。
    switch (node.type) {
      // 我们从顶层的 `Program` 开始，Program 结点中有一个 body 属性，它是一个由若干
      // 个结点组成的数组，所以我们对这个数组调用 `traverseArray`。
      //
      // （记住 `traverseArray` 会调用 `traverseNode`，所以我们会递归地遍历这棵树。）
      case "Program":
        traverseArray(node.body, node);
        break;

      // 下面我们对 `CallExpressions` 做同样的事情，遍历它的 `params`。
      case "CallExpression":
        traverseArray(node.params, node);
        break;

      // 如果是 `NumberLiterals`，那么就没有任何子结点了，所以我们直接 break
      case "NumberLiteral":
        break;

      // 同样，如果我们不能识别当前的结点，那么就抛出一个错误。
      default:
        throw new TypeError(node.type);
    }
  }

  // 最后我们对 AST 调用 `traverseNode`，开始遍历。注意 AST 并没有父结点。
  traverseNode(ast, null);
}

/**
 * ============================================================================
 *                                   转换器!!!
 * ============================================================================
 */

/**
 * 下面是转换器。转换器接收我们在之前构建好的 AST，然后把它和 visitor 传递进入我们的遍历
 * 器中 ，最后得到一个新的 AST。
 *
 * ----------------------------------------------------------------------------
 *            原始的 AST               |               转换后的 AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *         (那一边比较长/w\)            |         }]
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

// 定义我们的转换器函数，接收 AST 作为参数
function transformer(ast) {
  // 创建 `newAST`，它与我们之前的 AST 类似，有一个类型为 Program 的根节点。
  var newAst = {
    type: "Program",
    body: []
  };

  // 下面的代码会有些奇技淫巧，我们在父结点上使用一个属性 `context`（上下文），这样我们就
  // 可以把结点放入他们父结点的 context 中。当然可能会有更好的做法，但是为了简单我们姑且
  // 这么做吧。
  //
  // 注意 context 是一个*引用*，从旧的 AST 到新的 AST。
  ast._context = newAst.body;

  // 我们把 AST 和 visitor 函数传入遍历器
  traverser(ast, {
    // 第一个 visitor 方法接收 `NumberLiterals`。
    NumberLiteral: function(node, parent) {
      // 我们创建一个新结点，名字叫 `NumberLiteral`，并把它放入父结点的 context 中。
      parent._context.push({
        type: "NumberLiteral",
        value: node.value
      });
    },

    // 下一个，`CallExpressions`。
    CallExpression: function(node, parent) {
      // 我们创建一个 `CallExpression` 结点，里面有一个嵌套的 `Identifier`。
      var expression = {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: node.name
        },
        arguments: []
      };

      // 下面我们在原来的 `CallExpression` 结点上定义一个新的 context，它是 expression
      // 中 arguments 这个数组的引用，我们可以向其中放入参数。
      node._context = expression.arguments;

      // 然后来看看父结点是不是一个 `CallExpression`，如果不是...
      if (parent.type !== "CallExpression") {
        // 我们把 `CallExpression` 结点包在一个 `ExpressionStatement` 中，这么做是因为
        // 单独存在（原文为top level）的 `CallExpressions` 在 JavaScript 中也可以被当做
        // 是声明语句。
        //
        // 译者注：比如 `var a = foo()` 与 `foo()`，后者既可以当作表达式给某个变量赋值，也
        // 可以作为一个独立的语句存在。
        expression = {
          type: "ExpressionStatement",
          expression: expression
        };
      }

      // 最后我们把 `CallExpression`（可能是被包起来的） 放入父结点的 context 中。
      parent._context.push(expression);
    }
  });

  // 最后返回创建好的新 AST。
  return newAst;
}

/**
 * ============================================================================
 *                                代码生成器!!!!
 * ============================================================================
 */

/**
 * 现在只剩最后一步啦：代码生成器。
 *
 * 我们的代码生成器会递归地调用它自己，把 AST 中的每个结点打印到一个很大的字符串中。
 */

function codeGenerator(node) {
  // 对于不同 `type` 的结点分开处理。
  switch (node.type) {
    // 如果是 `Program` 结点，那么我们会遍历它的 `body` 属性中的每一个结点，并且递归地
    // 对这些结点再次调用 codeGenerator，再把结果打印进入新的一行中。
    case "Program":
      return node.body.map(codeGenerator).join("\n");

    // 对于 `ExpressionStatements`,我们对它的 expression 属性递归调用，同时加入一个
    // 分号。
    case "ExpressionStatement":
      return (
        codeGenerator(node.expression) + ";" // << (...因为我们喜欢用*正确*的方式写代码)
      );

    // 对于 `CallExpressions`，我们会打印出 `callee`，接着是一个左圆括号，然后对
    // arguments 递归调用 codeGenerator，并且在它们之间加一个逗号，最后加上右圆括号。
    case "CallExpression":
      return (
        codeGenerator(node.callee) +
        "(" +
        node.arguments.map(codeGenerator).join(", ") +
        ")"
      );

    // 对于 `Identifiers` 我们只是返回 `node` 的 name。
    case "Identifier":
      return node.name;

    // 对于 `NumberLiterals` 我们只是返回 `node` 的 value
    case "NumberLiteral":
      return node.value;

    // 如果我们不能识别这个结点，那么抛出一个错误。
    default:
      throw new TypeError(node.type);
  }
}

/**
 * ============================================================================
 *                         !!!!!!!!!!!!编译器!!!!!!!!!!!
 * ============================================================================
 */

/**
 * 最后！我们创建 `compiler` 函数，它只是把上面说到的那些函数连接到一起。
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

function compiler(input) {
  var tokens = tokenizer(input);
  var ast = parser(tokens);
  var newAst = transformer(ast);
  var output = codeGenerator(newAst);

  // 然后返回输出!
  return output;
}

/**
 * ============================================================================
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!你做到了!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * ============================================================================
 */

// 现在导出所有接口...
module.exports = {
  tokenizer: tokenizer,
  parser: parser,
  transformer: transformer,
  codeGenerator: codeGenerator,
  compiler: compiler
};
```
