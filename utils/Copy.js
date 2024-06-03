var fs = require("fs");
var stat = fs.stat;

var copy = function (src, dst) {
  //读取目录
  fs.readdir(src, function (err, paths) {
    if (err) {
      throw err;
    }
    paths.forEach(function (path) {
      var _src = src + "/" + path;
      var name = path.split(".js")[0];
      var _dst = dst + "/" + name;
      var readable;
      var writable;
      stat(_src, function (err, st) {
        if (err) {
          throw err;
        }

        if (st.isFile()) {
          const isMD = _dst.endsWith(".md");
          readable = fs.createReadStream(_src); //创建读取流
          writable = fs.createWriteStream(_dst + (isMD ? "" : ".md"), {
            encodint: "utf8",
            start: 0,
          }); //创建写入流
          if (!isMD) {
            // 将md文档转成 markdown 的 code
            writable.write("# " + name + "\n\n```js\n"); // 先写入头
          }

          readable.pipe(writable); // 再写内容

          if (!isMD) {
            readable.on("data", () => {
              writable.write("```"); // 再写入尾部
            });
          }
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
};

var exists = function (src, dst, callback) {
  //测试某个路径下文件是否存在
  const exists = fs.existsSync(dst);
  if (exists) {
    //不存在
    callback(src, dst);
  } else {
    //存在
    fs.mkdir(dst, function () {
      //创建目录
      callback(src, dst);
    });
  }
};

module.exports = copy;
