# pnpm

[官方文档](https://pnpm.io/zh/)

## 问题整理

### 1. pnpm Workspace 安装 其他子项目依赖 使用时候报错 Module not found: Error: Can't resolve 'workspace:\*'

解决: 安装使用具体方法的时候请使用具体版本号, 不要使用

```json
{
  "dependencies": {
    "s-low-components": "workspace:*", // 错误使用
    "s-low-core": "1.1.0" // 正确使用
  }
}
```
