# 前后端流式请求功能实现文档

## 概述

本项目实现了两种流式请求方式：

1. **Server-Sent Events (SSE)** - 使用 EventSource 实现聊天流式响应
2. **Fetch API + ReadableStream** - 使用 Fetch API 实现AI模拟流式响应

## 后端实现

### 1. 模块结构

```typescript
// app.module.ts
@Module({
  imports: [],
  controllers: [AppController, StreamingController],
  providers: [AppService, StreamingService],
})
export class AppModule {}
```

### 2. 流式控制器 (StreamingController)

#### 2.1 聊天流式响应接口

```typescript
@Get("chat")
@ApiOperation({ summary: "流式聊天响应" })
@ApiQuery({ name: "message", description: "用户输入的消息", required: true })
@ApiQuery({ name: "delay", description: "每个字符的延迟时间(毫秒)", required: false })
async streamChat(
  @Query("message") message: string,
  @Query("delay") delay: string = "100",
  @Res() res: Response
) {
  // 设置SSE响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 发送开始事件
  res.write("event: start\ndata: 开始处理您的消息...\n\n");
  res.flushHeaders();

  // 调用流式响应服务
  this.streamingService.streamResponse(message, delayNum, res);
}
```

**关键设置说明：**

- `Content-Type: text/event-stream` - 指定SSE响应类型
- `Cache-Control: no-cache` - 禁用缓存
- `Connection: keep-alive` - 保持连接
- `res.flushHeaders()` - 立即发送响应头

#### 2.2 AI模拟流式响应接口

```typescript
@Get("simulate-ai")
@ApiOperation({ summary: "模拟AI流式响应" })
@ApiQuery({ name: "prompt", description: "AI提示词", required: true })
@ApiQuery({ name: "responseType", description: "响应类型", required: false, enum: ["story", "code", "explanation"] })
@ApiQuery({ name: "speed", description: "响应速度", required: false, enum: ["slow", "normal", "fast"] })
async simulateAIResponse(
  @Query("prompt") prompt: string,
  @Query("responseType") responseType: string = "explanation",
  @Query("speed") speed: string = "normal",
  @Res() res: Response
) {
  // 设置响应头
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 调用AI流式服务
  await this.streamingService.simulateAIStream(prompt, responseType, speed, res);
}
```

### 3. 流式服务 (StreamingService)

#### 3.1 聊天流式响应实现

```typescript
async streamResponse(message: string, delay: number, res: Response): Promise<void> {
  try {
    // 发送开始事件
    res.write("event: start\ndata: 开始分析您的消息...\n\n");
    await this.sleep(300);

    // 发送分析事件
    res.write("event: analyzing\ndata: 正在分析消息内容...\n\n");
    await this.sleep(500);

    // 生成AI回复
    const aiResponse = await this.generateAIResponse(message);

    // 逐字符流式输出
    for (let i = 0; i < aiResponse.length; i++) {
      const char = aiResponse[i];

      res.write(`data: ${JSON.stringify({
        type: "chat",
        char,
        position: i,
        total: aiResponse.length,
        percentage: Math.round(((i + 1) / aiResponse.length) * 100),
      })}\n\n`);

      await this.sleep(delay);
    }

    // 发送完成事件
    res.write("event: complete\ndata: 回复生成完成\n\n");
  } catch (error) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
  }
}
```

**SSE消息格式说明：**

- `event: start` - 开始事件
- `event: analyzing` - 分析中事件
- `event: generating` - 生成中事件
- `event: complete` - 完成事件
- `event: error` - 错误事件
- `data:` - 数据字段，包含具体内容

#### 3.2 AI模拟流式响应实现

```typescript
async simulateAIStream(prompt: string, responseType: string, speed: string, res: Response): Promise<void> {
  const speedMap = { slow: 100, normal: 60, fast: 20 };
  const delay = speedMap[speed] || 100;

  let response = "";

  // 根据类型生成不同内容
  switch (responseType) {
    case "story": // 故事创作
    case "code":  // 代码生成
    case "explanation": // 解释说明
  }

  // 逐字符流式输出
  for (let i = 0; i < response.length; i++) {
    const char = response[i];

    res.write(`${JSON.stringify({
      type: "char",
      char,
      position: i,
      total: response.length,
    })}\n\n`);

    await this.sleep(delay);
  }
}
```

## 前端实现

### 1. EventSource 实现 (ChatStreaming.tsx)

#### 1.1 建立SSE连接

```typescript
const handleStream = async () => {
  if (!message.trim()) return;

  setIsLoading(true);
  setResponse("");
  setStatus("");

  try {
    // 创建EventSource连接
    const es = new EventSource(
      `http://localhost:3001/streaming/chat?message=${encodeURIComponent(message)}&delay=${delay}`
    );

    // 监听消息事件
    es.onmessage = (e) => {
      if (e.data) {
        const data = JSON.parse(e.data);
        if (data.type === "chat") {
          setResponse((prev) => prev + data.char);
        }
      }
    };

    // 监听完成事件
    es.addEventListener("complete", (res) => {
      console.log("complete", res);
      setIsLoading(false);
      setStatus("完成");
    });

    // 监听错误事件
    es.addEventListener("error", (res) => {
      console.log("error", res);
      setIsLoading(false);
      setStatus("错误");
    });
  } catch (error: any) {
    // 错误处理
  }
};
```

**EventSource 特点：**

- 自动重连机制
- 内置事件监听
- 支持多种事件类型
- 自动处理连接状态

### 2. Fetch API + ReadableStream 实现 (AIStreaming.tsx)

#### 2.1 建立流式连接

```typescript
const handleStream = async () => {
  if (!prompt.trim()) return;

  setIsLoading(true);
  setResponse("");

  const abortController = new AbortController();
  setController(abortController);

  try {
    // 发起Fetch请求
    const response = await fetch(
      `http://localhost:3001/streaming/simulate-ai?prompt=${encodeURIComponent(prompt)}&responseType=${responseType}&speed=${speed}`,
      {
        method: "GET",
        signal: abortController.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取响应流读取器
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流");
    }

    // 创建文本解码器
    const decoder = new TextDecoder();
    let accumulatedResponse = "";

    // 逐块读取响应
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      let data: any = {};

      try {
        data = JSON.parse(chunk);
      } catch (error) {}

      if (data.type === "char") {
        accumulatedResponse += data.char;
      }

      setResponse(accumulatedResponse);
    }
  } catch (error: any) {
    // 错误处理
  } finally {
    setIsLoading(false);
    setController(null);
  }
};
```

**Fetch API 流式处理特点：**

- 支持请求取消 (AbortController)
- 手动控制流读取
- 更灵活的响应处理
- 支持自定义解码逻辑

#### 2.2 请求取消机制

```typescript
const handleStop = () => {
  if (controller) {
    controller.abort();
  }
};
```

## 技术要点

### 1. SSE (Server-Sent Events)

**优势：**

- 自动重连
- 内置事件系统
- 浏览器原生支持
- 简单易用

**适用场景：**

- 实时通知
- 聊天应用
- 进度更新
- 状态同步

### 2. Fetch API + ReadableStream

**优势：**

- 更灵活的流控制
- 支持请求取消
- 自定义解码逻辑
- 更好的错误处理

**适用场景：**

- 文件下载
- 大文本生成
- 需要精确控制的流
- 复杂响应处理

### 3. 响应头设置

```typescript
// SSE响应头
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");

// 普通流响应头
res.setHeader("Content-Type", "text/plain");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
```

### 4. 消息格式规范

**SSE格式：**

```
event: start
data: 开始处理您的消息...

event: analyzing
data: 正在分析消息内容...

data: {"type":"chat","char":"您","position":0,"total":50,"percentage":2}

event: complete
data: 回复生成完成
```

**普通流格式：**

```
{"type":"char","char":"您","position":0,"total":50}
{"type":"char","char":"好","position":1,"total":50}
```

## 使用示例

### 1. 聊天流式响应

```bash
# 请求示例
GET /streaming/chat?message=你好&delay=100

# 响应示例
event: start
data: 开始处理您的消息...

event: analyzing
data: 正在分析消息内容...

data: {"type":"chat","char":"您","position":0,"total":25,"percentage":4}
data: {"type":"chat","char":"好","position":1,"total":25,"percentage":8}
...

event: complete
data: 回复生成完成
```

### 2. AI模拟流式响应

```bash
# 请求示例
GET /streaming/simulate-ai?prompt=写一个故事&responseType=story&speed=normal

# 响应示例
{"type":"char","char":"基","position":0,"total":200}
{"type":"char","char":"于","position":1,"total":200}
{"type":"char","char":"您","position":2,"total":200}
...
```

## 总结

本项目成功实现了两种流式请求方式，为不同的应用场景提供了灵活的解决方案：

1. **EventSource (SSE)** - 适合简单的实时通信场景
2. **Fetch API + ReadableStream** - 适合需要精确控制的复杂流处理场景

两种方式都支持：

- 实时流式响应
- 错误处理
- 状态管理
- 用户交互控制

通过合理的架构设计和实现，为前端提供了流畅的用户体验，为后端提供了高效的流式处理能力。
