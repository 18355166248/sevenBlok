# 下载资源

## 跨域资源下载

```javascript
// 通过指定url获取资源 ( 跨域情况下使用, 非跨域情况使用a标签  download自定义属性即可 )
const downloadFileUtil = {
  getBlob(url: string) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          if (xhr.response.type === "application/json") {
            const fileReader: any = new FileReader();
            // 说明返回的是普通对象, 读取信息
            fileReader.onloadend = () => {
              const jsonData = JSON.parse(fileReader.result);
              console.log(jsonData);

              jsonData.msg && message.error(jsonData.msg);
              reject(jsonData.msg);
            };
            fileReader.readAsText(xhr.response);
          } else {
            resolve(xhr.response);
          }
        }
      };

      xhr.send();
    });
  },

  saveAs(blob: any, filename: string) {
    let link: any = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(link.href);
    link = null;
  },

  load(file: { [url: string]: string }) {
    this.getBlob(file.url).then((blob) => {
      this.saveAs(blob, file.name);
    });
  },
};

export default downloadFileUtil;

function downloadFile(config) {
  downloadFileUtil.load(config);
}

downloadFile({
  url: record.fileStoreAddress,
  name: record.fileName,
});
```
