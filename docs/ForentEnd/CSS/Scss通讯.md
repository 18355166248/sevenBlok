# 让 JavaScript 与 CSS 和 Sass 对话

## https://www.cnblogs.com/ypppt/p/12868420.html

JavaScript 和 CSS 已经并存超过了 20 年。但是在它们之间共享数据非常困难。当然也有大量的尝试。但是我所想到的是一些简单而直观的内容——不涉及结构更改，而是使用 CSS 自定义属性甚至 Sass 变量。

## CSS 自定义属性和 JavaScript

自定义属性在这里应该不会令人感到惊讶。自浏览器提供支持以来，他们一直在做的一件事就是与 JavaScript 协同工作以设置和操作值。

不过具体来说，我们可以通过几种方式使 JavaScript 与自定义属性一起工作。可以使用 setProperty 设置自定义属性的值：

document.documentElement.style.setProperty("--padding", 124 + "px"); // 124px
我们还可以用 JavaScript 中的 getComputedStyle 来检索 CSS 变量。其背后的逻辑非常简单：自定义属性是样式的一部分，因此它们是计算样式的一部分。

getComputedStyle(document.documentElement).getPropertyValue('--padding') // 124px
与 getPropertyValue 一样。这样我们就可以从 HTML 标记的内联样式中获得自定义属性值。

document.documentElement.style.getPropertyValue("--padding'"); // 124px
请注意，自定义属性是有作用域的。这意味着我们需要从特定元素获取计算样式。正如我们之前在:root 中定义变量一样，我们将它们放在 HTML 元素上。

## Sass 变量和 JavaScript

Sass 是一种预处理语言，这意味着它在成为网站的一部分之前就已经变成了 CSS。所以无法用与 CSS 自定义属性相同的方式从 JavaScript 访问它们（可以在 DOM 中以计算样式访问它们）。

我们需要通过修改自己的构建过程来改变这一点。我怀疑在大多数情况下并不需要做太多，因为装载程序通常已经是构建过程的一部分。但是如果你的项目并非如此，则我们需要三个模块，这些模块能够导入和翻译 Sass 模块。

在 Webpack 配置中看上去是这样：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.scss\$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // ...
    ],
  },
}
```

为了使 Sass（或者在这种情况下，具体来说是 SCSS）变量可用于 JavaScript，我们需要 “export” 它们。

```scss
// variables.scss
$primary-color: #fe4e5e;
$background-color: #fefefe;
\$padding: 124px;

:export {
  primaryColor: $primary-color;
  backgroundColor: $background-color;
  padding: \$padding;
}
```

:export 块是 webpack 用来导入变量的。这种方法的好处是，我们可以用 camelCase 语法重命名变量，然后选择要公开的内容。

然后，把 Sass 文件（variables.scss）导入 JavaScript，从而可以访问文件中定义的变量。

```js
import variables from './variables.scss';

/_
{
primaryColor: "#fe4e5e"
backgroundColor: "#fefefe"
padding: "124px"
}
_/

document.getElementById("app").style.padding = variables.padding;
```

值得一提的是对 :export 语法的一些限制：

它必须在顶层，但可以在文件中的任何位置。
如果文件中有多个，则将 key 和 value 组合在一起一并导出。
如果特定的 exportedKey 被复制，则最后一个（按源顺序）优先。
exportedValue 可以含有在 CSS 声明值中任何有效的字符（包括空格）。
exportedValue 不需要被引用，因为它已经被当作文本字符串了。
有很多方法可以方便地访问 JavaScript 中的 Sass 变量。我倾向于使用这种共享断点的方法。下面是我的 breakpoints.scs 文件，后来我将其导入 JavaScript 中，这样我可以用 matchMedia()方法得到一致的断点。

```js
// Sass variables that define breakpoint values
\$breakpoints: (
mobile: 375px,
tablet: 768px,
// etc.
);

// Sass variables for writing out media queries
$media: (
  mobile: '(max-width: #{map-get($breakpoints, mobile)})',
tablet: '(max-width: #{map-get(\$breakpoints, tablet)})',
// etc.
);

// The export module that makes Sass variables accessible in JavaScript
:export {
breakpointMobile: unquote(map-get($media, mobile));
  breakpointTablet: unquote(map-get($media, tablet));
// etc.
}
```

动画是另一个用例。动画的持续时间通常存储在 CSS 中，但是需要 JavaScript 的帮助才能完成更复杂的动画。

```scss
// animation.scss
$global-animation-duration: 300ms;
$global-animation-easing: ease-in-out;

:export {
  animationDuration: strip-unit($global-animation-duration);
  animationEasing: $global-animation-easing;
}
```

请注意，在导出变量时，我用了自定义 strip-unit 函数。这使我可以轻松地在 JavaScript 中解析内容。

```js
// main.js
document.getElementById('image').animate(
  [
    { transform: 'scale(1)', opacity: 1, offset: 0 },
    { transform: 'scale(.6)', opacity: 0.6, offset: 1 },
  ],
  {
    duration: Number(variables.animationDuration),
    easing: variables.animationEasing,
  }
)
```
