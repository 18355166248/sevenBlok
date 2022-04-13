# 下载资源

## 跨域资源下载

```javascript
// 通过指定url获取资源 ( 跨域情况下使用, 非跨域情况使用a标签  download自定义属性即可 )
const downloadFileUtil = {
  getBlob(url: string) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
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
