# 在vue中用canvas压缩图片

```vue
<template>
  <div class="upload">
    <input
      type="file"
      ref="uploadInput"
      accept="image/*"
      @change="upload"
      v-if="android"
    />
    <input
      type="file"
      ref="uploadInput"
      accept="image/*"
      @change="upload"
      v-else
    />
  </div>
</template>

<script>
import { decideTerminal } from "common/js/util";
export default {
  props: {
    data: [String, Object]
  },
  data() {
    return {
      android: decideTerminal().isAndroid
    };
  },
  methods: {
    upload(e) {
      this.$emit("uploadLoad");
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      // console.log(this.picValue)
    },
    imgPreview(file) {
      let that = this;
      let Orientation;
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      // EXIF.getData(file, function () {
      //   Orientation = EXIF.getTag(this, 'Orientation')
      // })
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          let data;
          img.src = result;
          //  判断图片是否大于300K,是就直接上传，反之压缩图片
          if (this.result.length <= 300 * 1024) {
            data = this.result;
            // base64转blob
            const blob = that.baseToBlob(data);
            that.$emit("input", blob);
            that.$refs.uploadInput.value = "";
          } else {
            img.onload = function() {
              data = that.compress(img, Orientation);
              that.$emit("input", data);
              that.$refs.uploadInput.value = "";
            };
          }
        };
      }
    },
    postImg() {
      let base64 = "";
      let index = this.data.indexOf(",");
      if (index !== -1) {
        base64 = this.data.substring(index + 1);
      }
      if (base64) {
        // 这里写接口
      }
    },
    rotateImg(img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0;
      const maxStep = 3;
      if (img == null) return;
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = minStep;
      }
      if (direction === "right") {
        step++;
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep);
      } else {
        step--;
        step < minStep && (step = maxStep);
      }
      // 旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    // base64转blob
    baseToBlob(file) {
      var base64String = file; /* base64图片串 */

      // 这里对base64串进行操作，去掉url头，并转换为byte
      var bytes = window.atob(base64String.split(",")[1]);

      // 处理异常，将ASCII码小于0的转换为大于0，这里有两种写法
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i); // 这里有点疑惑，ia是怎么改变ab的？注：①
      }
      // Blob对象
      var blob = new Blob([ab], { type: "image/jpeg" }); // type为图片的格式
      return blob;
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      // 瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width = width / ratio;
        height = height / ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        // console.log('超过100W像素')
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation !== "" && Orientation !== 1) {
        switch (Orientation) {
          case 6: // 需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: // 需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: // 需要180度旋转
            this.rotateImg(img, "right", canvas); // 转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      // 进行最小压缩 转成base64
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      // base64转blob
      const blob = this.baseToBlob(ndata);

      // console.log('压缩前：' + initSize)
      // console.log('压缩后：' + ndata.length)
      // console.log(
      //   '压缩率：' + ~~((100 * (initSize - ndata.length)) / initSize) + '%'
      // )
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return blob;
    }
  }
};
</script>

<style lang="scss" scoped>
.upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
  }
}
</style>
```
