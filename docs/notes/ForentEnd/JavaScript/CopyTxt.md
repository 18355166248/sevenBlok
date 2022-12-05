# 复制文本

```ts
import { Toast } from "antd-mobile";

// 复制文本
export function CopyTxt(str: string, isShowToast = true) {
  if (typeof document.execCommand === "function") {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("readonly", "readonly");
    input.setAttribute("value", str);
    // safari 这个方法有兼容问题造成无法执行下面代码
    input.select();
    // 兼容上诉代码
    // HTMLInputElement.setSelectionRange 方法用于设定<input> 或 <textarea> 元素中当前选中文本的起始和结束位置。
    input.setSelectionRange(0, str.length);
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log(err);
    }
    document.body.removeChild(input);

    isShowToast && Toast.info("复制成功", undefined, undefined, false);
  } else {
    Toast.info("当前环境不支持复制");
  }
}

export function newCopy(str: string, isShowToast = true) {
  if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    const el = document.createElement("input");
    el.value = str; // 要复制的内容
    el.style.opacity = "0";
    document.body.appendChild(el);
    const editable = el.contentEditable;
    const readOnly = el.readOnly;
    el.contentEditable = "true";
    el.readOnly = false;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    el.setSelectionRange(0, 999999);
    el.contentEditable = editable;
    el.readOnly = readOnly;
    const ret = document.execCommand("copy");
    el.blur();
    if (ret) {
      isShowToast && Toast.info("复制成功", undefined, undefined, false);
    } else {
      Toast.info("复制失败");
    }
  } else {
    CopyTxt(str, isShowToast);
  }
}
```
