### webpack4, 对项目打包进行优化速度

#### 1. thread-loader

把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行

#### 2. HappyPack ( 不推荐)

happypack 的处理思路是将原有的 webpack 对 loader 的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变。使用 HappyPack 也有一些限制，它只兼容部分主流的 loader，具体可以查看官方给出的

**注意：Ahmad Amireh 推荐使用 thread-loader，并宣布将不再继续维护 happypack，所以不推荐使用它**

#### 3. cache-loader (缓存)

cache-loader 和 thread-loader 一样，使用起来也很简单，仅仅需要在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里，显著提升二次构建速度。

#### 4. HardSourceWebpackPlugin (缓存)

- 第一次构建将花费正常的时间
- 第二次构建将显着加快（大概提升 90%的构建速度）。

#### 5. 优化搜索时间

  ##### 5.1 优化 loader 配置

  ##### 5.2 优化 resolve.module 配置

  ##### 5.3 优化 resolve.alias 配置

  ##### 5.4 优化 resolve.extensions 配置

#### 6. 优化压缩时间

  ##### 6.1 terser-webpack-plugin 启动多进程

​
