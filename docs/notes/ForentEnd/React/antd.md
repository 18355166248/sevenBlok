# antd(React)问题整理

## 1. antd 4.7.0版本与bizchart使用，popovertooltip会出现抖动，初始定位不准

antd 4.7.0版本与bizchart一起使用，popover及tooltip会出现抖动，初始定位不准，定位两次。（弹层内容为普通固定文本，非图片）4.0.4版本没问题

请问解决了吗，我也遇到了同样的问题

我也遇到了这个问题.

原因是: 默认的transitionName "zoom-big-fast" 导致的. 暂时认为是样式过渡导致的视觉效果.

解决方式: 在使用Popover或者Tooltip时, 添加 transitionName= '' 覆盖默认值

```react
<Popover transitionName='' {...otherProps}>{ /* your other code */}</Popover>
```

Tooltip 同理.
