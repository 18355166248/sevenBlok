# 使用React Hook编写函数组件

## 强制刷新组件

```js
const [data, setData] = useState(dataSource);
const [refreshKey, setRefreshKey] = useState(null); // 这里可以用时间戳

  useEffect(() => {
    if (!_.isEqual(dataSource, data)) {
      setData(dataSource);
    }
  }, [dataSource, refreshKey]);
```

当refreshKey变化的时候 就会触发useEffect 然后做一些处理重新刷新组件