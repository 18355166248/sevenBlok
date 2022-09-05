# 兼容性-Compatibility

## Safari 下 border-radius 无效

Safari 使用 border-radius 搭配 overflow: hidden 沒有圓角效果的問題

发现在 Safari 上使用 border-radius 搭配 overflow: hidden 没有圆角效果，这其实是 Safari 在呈现计算上的错误 [Bug]，可以藉由设定遮罩让其重新计算。

解决:

```css
element selector {
  border-radius: 10px;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
}
```

#### 或是設定 z-index 讓他重新計算堆疊位置，程式碼如下：

```css
element selector {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  z-index: 0;
}
```
