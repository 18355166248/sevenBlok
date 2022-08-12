# 代码片段

1. 注释代码

```json
{
  "Print to notes": {
    "scope": "javascript,typescript",
    "prefix": "//",
    "body": [
      "/**",
      " * @Description $1",
      " * @Author lang.jiang",
      " * @Date ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE} ${CURRENT_HOUR}:${CURRENT_MINUTE}:${CURRENT_SECOND}",
      " */"
    ],
    "description": "Log output to console"
  }
}
```

2. react

```json
{
  "Print to console": {
    "prefix": "log",
    "body": ["console.log($1)"],
    "description": "Log output to console"
  },
  "React Function Component Template": {
    "prefix": "cf",
    "body": [
      "import React, { FC } from 'react';",
      "",
      "interface Props {",
      "  ",
      "}",
      "",
      "const $1: FC<Props> = () => {",
      "  return (",
      "",
      "  );",
      "};",
      "",
      "export default $1;"
    ],
    "description": "快速创建函数式组件"
  },
  "Function": {
    "prefix": "func",
    "body": ["function $1() {", "", "}"],
    "description": "快速方法"
  }
}
```
