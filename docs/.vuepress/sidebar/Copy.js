var fs = require("fs");
var stat = fs.stat;

var copy = function(src, dst) {
  //读取目录
  fs.readdir(src, function(err, paths) {
    if (err) {
      throw err;
    }
    paths.forEach(function(path) {
      var _src = src + "/" + path;
      var name = path.split(".js")[0];
      var _dst = dst + "/" + name + ".md";
      var readable;
      var writable;
      stat(_src, function(err, st) {
        if (err) {
          throw err;
        }

        if (st.isFile()) {
          console.log(_dst, dst);
          readable = fs.createReadStream(_src); //创建读取流
          writable = fs.createWriteStream(_dst, { encodint: "utf8", start: 0 }); //创建写入流
          writable.write("# " + name + "\n\n");
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
};

var exists = function(src, dst, callback) {
  //测试某个路径下文件是否存在
  fs.exists(dst, function(exists) {
    if (exists) {
      //不存在
      callback(src, dst);
    } else {
      //存在
      fs.mkdir(dst, function() {
        //创建目录
        callback(src, dst);
      });
    }
  });
};

module.exports = copy;
