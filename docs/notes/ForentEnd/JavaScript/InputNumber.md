# H5 数字输入框限制

### 展示代码

监听输入框 onInput 和 onChange

```js
<input
  ref={amountRef}
  value={amount}
  placeholder={`最多可提现${max}元`}
  type="tel"
  pattern="[0-9]*"
  onInput={onKeyUp}
  onChange={onKeyUp}
  max={max}
  min={1}
/>
```

我们需要限制输入框只能输入数字和小数点 且限制只能输入浮点数后两位

```typescript
function onKeyUp(evt: any) {
  const value = (evt.target as HTMLInputElement).value;
  // 没有值的话直接置空
  if (value === "") setAmount("");

  // 输入的不是数字直接拦截不能往下输入
  // 带小数点的Number转化后会剔除小数点 例如 '11.' 会转成 11
  if (!Number(value)) {
    return;
  }

  // 格式化输入内容
  let filterValue: string | number = checkPrice(value);

  // 输入的最后一位不是点就比较最大值反之不比较
  if (filterValue[filterValue.length - 1] !== ".") {
    filterValue = Math.min(max, Number(filterValue));
  }

  setAmount(filterValue);
}
```

格式化方法

```typescript
export function checkPrice(val: string) {
  let checkPlan = "" + val;
  checkPlan = checkPlan
    .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
    .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
    .replace(/^\./g, "") // 保证第一个为数字而不是.
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", "."); // 以上三步再次将字符串中存在的多余.清除

  if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    checkPlan = parseFloat(checkPlan) + "";
  } else if (checkPlan.indexOf(".") >= 0) {
    checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
  }
  return checkPlan;
}
```
