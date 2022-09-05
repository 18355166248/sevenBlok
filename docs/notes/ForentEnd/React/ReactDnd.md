# ReactDnd

[官网](https://react-dnd.github.io/react-dnd/examples)

## 问题

#### 1. 怎么隐藏自带的拖拽浮层

隐藏

```typescript
import { getEmptyImage } from "react-dnd-html5-backend";

const [{ isDragging }, dragRef, preview] = useDrag(() => {
  return {
    type: CARD,
    item: { data },
    collect: (monitor) => {
      const isDragging = monitor.isDragging();
      setIsDragging(isDragging);
      return {
        isDragging,
      };
    },
    end() {
      console.log("end");
    },
  };
});

useEffect(() => {
  preview(getEmptyImage(), { captureDraggingState: true });
}, []);
```

自定义

```typescript
// 使用
const [{ isOver, canDrop, item }, drop] = useDrop(() => ({}))

<div
  ref={drop}
  className={styles.pageLayer}
  style={{ zIndex: isDragging ? 20 : 1 }}
>
  <CustomDragLayer />
</div>


// 定义
import { useDragLayer } from "react-dnd";

function CustomDragLayer() {
  const { item, isDragging, clientOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !clientOffset) return null;

  return (
    <div className="fixed pointer-events-none inset-0">
      <div
        className={"p-2 text-center text-gray-600"}
        style={{
          transform: `translate(${clientOffset.x - 10}px, ${
            clientOffset.y - 10
          }px)`,
        }}
      >
        <div className="mb-2">
          <span className={`iconfont ${item?.data.iconfont}`}></span>
        </div>
        <div>{item?.data.name}</div>
      </div>
      {/* <div
        className="px-3 py-1 text-center bg-red-900 bg-opacity-50 rounded-sm text-white inline-block"
        style={{
          transform: `translate(${clientOffset.x - 10}px, ${
            clientOffset.y - 10
          }px)`,
        }}
      >
        {item?.data?.name}
      </div> */}
    </div>
  );
}

export default CustomDragLayer;
```
