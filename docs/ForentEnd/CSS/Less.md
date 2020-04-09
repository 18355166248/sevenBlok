# Less 常用案例

1. 设置自定义属性匹配 css

设置文本缩略自定义属性

```less
.data-text-overflow-mixin(@size: 1, @max: 20) when (@size <= @max) {
  [data-text-overflow='@{size}'] when (@size = 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [data-text-overflow='@{size}'] when (@size > 1) {
    /* autoprefixer: off */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @size;
    -webkit-box-orient: vertical;
    white-space: normal;
  }

  .data-text-overflow-mixin(@size + 1, @max);
}
```
