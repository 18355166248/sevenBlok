# 正则表达式

正则表达式（Regular Expression 或 Regex），是用于定义某种特定搜索模式的字符组合。正则表达式可用于匹配、查找和替换文本中的字符，进行输入数据的验证，查找英文单词的拼写错误等。

### 调试工具

1. Regex101（https://regex101.com/）
2. Regexr（https://regexr.com/）

## 开始

### 1. Flags（标志符或修饰符）

Flags 写在结束的/之后，可以影响整个正则表达式的匹配行为。常见的 flags 有：

1. g：全局匹配（global）；正则表达式默认只会返回第一个匹配结果，使用标志符 g 则可以返回所有匹配

2. i：忽略大小写（case-insensitive）；在匹配时忽略英文字母的大小写

3. m：多行匹配（multiline）；将开始和结束字符（^和\$）视为在多行上工作，即分别匹配每一行（由 \n 或 \r 分割）的开始和结束，而不只是只匹配整个输入字符串的最开始和最末尾处

### 2. Character Sets（字符集合）

用于匹配字符集合中的任意一个字符，常见的字符集有：

1. [xyz]：匹配 "x"或"y"`"z"`

2. [^xyz]：补集，匹配除 "x" "y" "z"的其他字符

3. [a-z]：匹配从 "a" 到 "z" 的任意字符

4. [^a-n]：补集，匹配除 "a" 到 "n" 的其他字符

5. [A-Z]：匹配从 "A" 到 "Z" 的任意字符

6. [0-9]：匹配从 "0" 到 "9" 的任意数字

### 3. Quantifiers (量词)

在实际使用中，我们常常需要匹配同一类型的字符多次，比如匹配11位的手机号，我们不可能将 [0-9] 写11遍，此时我们可以使用Quantifiers来实现重复匹配。

1. {n}：匹配 n 次

2. {n,m}：匹配 n-m 次

3. {n,}：匹配 >=n 次

4. ?：匹配 0 || 1 次

5. *：匹配 >=0 次，等价于 {0,}

6. +：匹配 >=1 次，等价于 {1,}

### 4. Metacharacters（元字符）

在正则表达式中有一些具有特殊含义的字母，被称为元字符，简言之，元字符就是描述字符的字符，它用于对字符表达式的内容、转换及各种操作信息进行描述。

常见的元字符有：

1. \d：匹配任意数字，等价于 [0-9]

2. \D：匹配任意非数字字符；\d 的补集  除了[0-9]

3. \w：匹配任意基本拉丁字母表中的字母和数字，以及下划线；等价于 [A-Za-z0-9_]

4. \W：匹配任意非基本拉丁字母表中的字母和数字，以及下划线；\w 的补集

5. \s：匹配一个空白符，包括空格、制表符、换页符、换行符和其他Unicode空格

6. \S：匹配一个非空白符；\s的补集

7. \b：匹配一个零宽单词边界，如一个字母与一个空格之间；例如，/\bno/匹配"at noon"中的"no"，/ly\b/ 匹配"possibly yesterday."中的"ly"

8. \B：匹配一个零宽非单词边界，如两个字母之间或两个空格之间；例如，/\Bon/ 匹配"at noon"中的"on"，/ye\B/ 匹配"possibly yesterday."中的"ye"

9. \t：匹配一个水平制表符（tab)

10. \n：匹配一个换行符（newline)

11. \r：匹配一个回车符（carriage return)

12. \f: 换页符

### 5. Special Characters (特殊字符)

正则中存在一些特殊字符，它们不会按照字面意思进行匹配，而有特殊的意义，比如前文讲过用于量词的?、*、+。其他常见的特殊字符有：

1. \：转义字符，可以将普通字符转成特殊字符。比如 \w；也可以将特殊字符转成字面意思，比如 \+匹配 "+"

2. .：匹配任意单个字符，但是换行符除外：\n, \r, \u2028 或 \u2029；在字符集中（[.]），无特殊含义，即表示 '.' 的字面意思

3. |：替换字符（alternate character），匹配 | 前或后的表达式。比如需要同时匹配"bear"和"pear"，可以使用 /(b|p)ear/ 或者/bear|pear/；但是不能用 /b|pear/，该表达式只能匹配 "b" 和 "pear"

4. ^：匹配输入的开始。比如，/^A/ 不匹配"an Apple" 中的 "A"，但匹配 "An apple" 中的 "A"

5. $：匹配输入的结尾。比如，/t$/ 不匹配"eater" 中的 "t"，但匹配 "eat" 中的 "t"。^ 和 $ 在表单验证时常需要使用，因为需要验证从开始到结尾的一个完整输入，而不是匹配输入中的某一段

### 6. Groups（分组）

1. (xyz)：捕获分组（Capturing Group），匹配并捕获匹配项；例如，/(foo)/ 匹配且捕获"foo bar." 中的"foo"。被匹配的子字符串可以在结果数组的元素 [1], ..., [n] 中找到，或在被定义的 RegExp 对象的属性 $1, ..., $9 中找到

2. (?:xyz)：非捕获分组（Non-capturing Group），匹配但不会捕获匹配项；匹配项不能再次被访问到

3. \n：n 是一个正整数，表示反向引用（back reference），指向正则表达式中第n个括号（从左开始数）中匹配的子字符串；例如/apple(,)\sorange\1/ 匹配"apple,orange,cherry, peach." 中的"apple,orange,"

### 7. Assertion（断言）

1. x(?=y)：仅匹配被y跟随的x；例如，/bruce(?=wayne)/，如果"bruce"后面跟着wayne，则匹配之。/bruce(?=wayne|banner)/ ，如果"bruce"后面跟着"wayne"或者banner，则匹配之。但是"wayne" 和"banner" 都不会在匹配结果中出现

2. x(?!y)：仅匹配不被y跟随的x；例如，/\d+(?!\.)/ 只会匹配不被 "." 跟随的数字。



/\d+(?!\.)/.exec('3.141') 匹配"141"，而不是"3.141"

### 8. (?:pattern)、(?=pattern)、(?!pattern)、(?<=pattern)和(?<!pattern)

::: details 展开
#### (?:pattern)#
()表示捕获分组，()会把每个分组里的匹配的值保存起来，从左向右，以分组的左括号为标志，第一个出现的分组的组号为1，第二个为2，以此类推

(?:)表示非捕获分组，和捕获分组唯一的区别在于，非捕获分组匹配的值不会保存起来
```js
a = "123abc456ww"
reg = /([0-9]*)([a-z]*)([0-9]*)/
a.match(reg) // ['123abc456', '123', 'abc', '456', index: 0, input: '123abc456ww', groups: undefined]

reg2 = /(?:[0-9]*)([a-z]*)([0-9]*)/
a.match(reg2) // ['123abc456', 'abc', '456', index: 0, input: '123abc456ww', groups: undefined]
```

可以看到 (?:[0-9]*) 匹配的第一个 [0-9]*  没有保存下来，即没有保存匹配到的“123”，而([0-9]*)则保存了下来。


#### (?=pattern)#

正向肯定预查（look ahead positive assert），匹配pattern前面的位置。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。

例如，"Windows(?=95|98|NT|2000)"能匹配"Windows2000"中的"Windows"，但不能匹配"Windows3.1"中的"Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。

```js
a ='window12345'
reg = /window(?=123)/
a.match(reg)
// ['window', index: 0, input: 'window12345', groups: undefined]
```


#### (?!pattern)#

正向否定预查(negative assert)，在任何不匹配pattern的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。

简单说，以 xxx(?!pattern)为例，就是捕获不以pattern结尾的内容xxx

例如"Windows(?!95|98|NT|2000)"能匹配"Windows3.1"中的"Windows"，但不能匹配"Windows2000"中的"Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。

```js
a = 'window123window456'
reg = /window(?!12)/
a.match(reg)
// ['window', index: 9, input: 'window123window456', groups: undefined]
// 注意这里的 index 是9
```

#### (?<=pattern)#

反向(look behind)肯定预查，与正向肯定预查类似，只是方向相反。

简单说，以(?<=pattern)xxx为例，就是捕获以pattern开头的内容xxx。

例如，"(?<=95|98|NT|2000)Windows"能匹配"2000Windows"中的"Windows"，但不能匹配"3.1Windows"中的"Windows"。

```js
a ='window123window456'
reg = /(?<=123)window/
a.match(reg)
// ['window', index: 9, input: 'window123window456', groups: undefined]
```

#### (?<pattern)#

简单说，以(?<!pattern)xxx为例，就是捕获不以pattern开头的内容xxx。

反向否定预查，与正向否定预查类似，只是方向相反。例如"(?<!95|98|NT|2000)Windows"能匹配"3.1Windows"中的"Windows"，但不能匹配"2000Windows"中的"Windows"。

```js
a ='window123window456'
reg = /(?<!123)window/
a.match(reg)
// ['window', index: 0, input: 'window123window456', groups: undefined]
```

:::
