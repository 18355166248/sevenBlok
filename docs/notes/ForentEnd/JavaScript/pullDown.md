# 记录一次 AI 聊天上拉刷新加载历史的踩坑经历

## 背景

这是一个 AI 机器人导购的一个 h5 聊天项目, 我接手这个项目的时候已经上线过一版了, 只是没有做上拉加载历史记录的功能.
我接手这个项目后, 发现这个功能很实用, 于是就开始评审需求
但是在做的过程中, 发现并不是很好实现, 下面记录一下我的踩坑经历.

## 调研

一开始看了微信的向上滚动, 看到有点像自己的需求效果

<video width="335" height="720" controls>
    <source src="./mp4/wx-pullScroll.mp4" type="video/mp4">
</video>

然后想了下之前使用过的框架, 也通过各个网站搜索了下其他开发者的实现方式, 最终确定先使用
[better-scroll](https://better-scroll.github.io/docs/zh-CN/) 尝试下实现, 正好 better-scroll 已经支持上拉加载历史记录的功能, 于是就决定使用这个框架来实现.

## 实现([better-scroll](<(https://better-scroll.github.io/docs/zh-CN/)>))

<video width="375" height="667" controls>
    <source src="./mp4/better-pull-down.mov" type="video/mp4">
</video>

看上面的录屏可以发现, 使用了 better-scroll 的 pull-down 功能, 在触发下拉刷新的时候, 请求服务端拿到历史数据列表, 将数据 unshift 到列表顶部, 但是滚动条直接置顶了, 并没有保持在页面的当前位置, 通过几次尝试, 发现无法完美的解决这个问题. 于是考虑放弃 better-scroll

## 实现[InfiniteScroll](https://www.npmjs.com/package/react-infinite-scroll-component)

在搜索了几篇文章后, 发现了一个第三方库 react-infinite-scroll-component 是做滚动的, 看了官方 demo, 发现它的 Infinite Scroll on top 功能很适合我目前的业务场景, 于是就决定使用这个库来实现.

```jsx
function ScrollToTop() {
  return (
    <div
      id="scrollableDiv"
      style={{
        height: 300,
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      {/*Put the scroll bar always on the bottom*/}
      <InfiniteScroll
        dataLength={this.state.items.length}
        next={this.fetchMoreData}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={true}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {this.state.items.map((_, index) => (
          <div style={style} key={index}>
            div - #{index}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
```

使用起来还是比较简单的, 实现方式是通过翻转的方式, 翻转后, 我们向上滚动其实是向下滚动的, 所以我们只要往上滚动, 触发加载历史记录, 将数据加载进列表, 就会自动出现滚动条, 且不会出现滚动条置顶的情况.

插入历史消息带来的抖动问题是因为在已有 dom 的前面插入 dom。如果能够在已有 dom 的后面插入新增 dom 并且在视觉上看起来是在顶部插入的则可以解决该问题。前端开发中聊天场景的体验优化一文中给出的方案是 transform:rotate(180deg)；。另外 flex-direction:reverse 也是可以做到的。

由于会话场景的一些其他特点如列表初始化时定位在底部（新消息在底部），本文的实现采用了 transform:rotateX(180deg)方式处理进行处理。由于只需要在垂直方向进行翻转，所以在实现时使用 rotateX 代替了 rotate。

具体的实现思路可以看 [前端开发中聊天场景的体验优化](http://www.alloyteam.com/2020/04/14349/)

### 回到 InfiniteScroll

我们接入后发现了新的问题, 假如说刚进入聊天室按要求是不需要加载历史记录的, 需要下拉才需要加载, 但是刚进入聊天室的时候, 聊天只有一条欢迎信息, 不会出现滚动条, 没有滚动条, InfiniteScroll 就不会触发下拉滚动行为.

之后我尝试了刚进入聊天室的时候, 将聊天室自动加个滚动条, 确实可以触发下拉了, 但是只是很简单的滚动效果, 没有那种下拉拖拽的效果, 体验很不好. 而且因为强行增加了滚动条, 在正常聊天的时候, 下面会多出一大块空白.

但是 InfiniteScroll 其实已经帮助完成了滚动加载的效果了, 执行初始化有体验问题

我就在想, 将问题聚焦化, 能不能只解决初始化的体验问题, 而不是将问题放大.

然后就尝试自己手动实现下拉效果, 完成初始化滚动条的问题.

```tsx
import { FC, useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import "./index.css";
import LoadingCat from "../LoadingCat";

interface ScrollProps {
  dataLength: number;
  fetchMoreData: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hasMore?: boolean;
  stop?: number; // 回弹停留位置
  loadingTime?: number; // 加载时间
  pulldownRefresh: () => Promise<any>; // 下垃回调函数
  isPullDown?: boolean; // 第一次下拉刷新是否已经执行
}

const ScrollToTop: FC<ScrollProps> = ({
  dataLength,
  fetchMoreData,
  children,
  style,
  hasMore = true,
  stop = 50,
  loadingTime = 300,
  pulldownRefresh,
  isPullDown,
}) => {
  const viewRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState(0);
  const [top, setTop] = useState(0);
  const [dynamic, setDynamic] = useState(false);

  const handleTouchStart = useCallback(
    (e) => {
      if (isPullDown) return;
      const [touches = {}] = e.changedTouches;
      const { pageY } = touches;

      setStartY(pageY);
    },
    [isPullDown]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (isPullDown) return;
      const [touches] = e.changedTouches;
      const { pageY } = touches;

      if (viewRef?.current) {
        const { scrollTop } = viewRef.current;
        const differ = pageY - startY;

        if (scrollTop === 0 && differ > 0) {
          const _diff = top > stop ? stop + Math.log10(differ) : top + 2;
          setTop(_diff);
        }
      }
    },
    [startY, top, stop, isPullDown]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (isPullDown) return;
      const [touches] = e.changedTouches;
      const { pageY } = touches;

      if (viewRef?.current) {
        const { scrollTop } = viewRef.current;
        const differ = pageY - startY;

        if (scrollTop === 0 && differ > stop && differ > 20) {
          // 下拉超过阈值
          setTop(stop);
          setDynamic(true);
          pulldownRefresh()
            .then(() => {
              setTimeout(() => {
                setTop(0);
                setDynamic(false);
              }, loadingTime);
            })
            .catch(() => {
              setTimeout(() => {
                setTop(0);
                setDynamic(false);
              }, loadingTime);
            });
        } else {
          setTop(0);
        }
      }
    },
    [startY, stop, pulldownRefresh, loadingTime, isPullDown]
  );

  useEffect(() => {
    const view = viewRef?.current;

    if (view) {
      view.addEventListener("touchstart", handleTouchStart, { passive: false });
      view.addEventListener("touchmove", handleTouchMove, { passive: false });
      view.addEventListener("touchend", handleTouchEnd, { passive: false });
    }
    return () => {
      if (view) {
        view.removeEventListener("touchstart", handleTouchStart);
        view.removeEventListener("touchmove", handleTouchMove);
        view.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      id="scrollableDiv"
      ref={viewRef}
      style={{
        height: 300,
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        boxSizing: "border-box",
        overflowAnchor: "none",
        ...style,
      }}
    >
      {!isPullDown && <LoadingCat dynamic={dynamic} />}
      {/*Put the scroll bar always on the bottom*/}
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchMoreData}
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          transform: `translate3d(0px, ${top}px, 0px)`,
        }} //To put endMessage and loader to the top.
        inverse={true}
        hasMore={hasMore}
        loader={<Loading style={{ marginBottom: 10 }} />}
        hasChildren={true}
        scrollableTarget="scrollableDiv"
      >
        {children}
      </InfiniteScroll>
    </div>
  );
};

export default ScrollToTop;
```

以上就是我最终完成的组件代码，其中`InfiniteScroll`组件是[react-infinite-scroll-component](https://www.npmjs.com/package/react
下拉刷新手动实现的, 且只会执行一次, 后续加载只需要滚动即可。

<video width="375" height="667" controls>
    <source src="./mp4/InfiniteScroll-guide.mov" type="video/mp4">
</video>

# 总结

在接收这个需求的过程中, 确实走了很多弯路, 且最后的实现也不是完全靠自己, 还是依赖了三方库, 虽然很轻量, 但是开发时间确实很紧张, 有些功能确实靠自己去写, 很担心会出现一些兼容问题.

而且在中间在遇到问题的时候, 确实是直接卡住没有思路和方案了

但是结局是好的, 最终实现了这个功能, 虽然中间走了很多弯路, 但是也学到了很多东西.

在此记录下, 希望可以帮到大家.
