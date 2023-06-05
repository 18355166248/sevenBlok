# 上传文件

## js

```js
const formData = new FormData();
fileList.forEach((file) => {
  formData.append("files", file, file.name); // file 就是你的文件 也就是input 上的 event.target.files
});

formData.append("merchantOrderNo", item.merchantOrderNo);

batchUploadElecInvoices(formData);

export const batchUploadElecInvoices = (data: any) => {
  const url = `/${baseUrl}/withdraw/batchUploadElecInvoices`;
  return $axios_upload.post(url, data, {
    headers: { "Content-type": "multipart/form-data" },
  });
};
```

## antd

```js
const UploadProps: UploadProps = {
  name: "file",
  action: `${baseUrl}/client/tobInvoiceApply/upload`,
  headers: {
    authorization: "authorization-text",
  },
  multiple: true,
  onChange(info: any) {
    const attachmentsCopy = state.attachments;
    const { file } = info;
    if (file.status === "done") {
      message.success({
        key: file.name,
        content: `${file.name} 文件上传成功`,
      });
      attachmentsCopy.push(file.response.data);
    } else if (file.status === "error") {
      message.error({
        key: file.name,
        content: `${file.name} 文件上传失败`,
      });
    } else if (file.status === "removed") {
      const index = attachmentsCopy.findIndex(
        (v: any) => v.storageId === file.response.data.storageId
      );
      index > -1 && attachmentsCopy.splice(index, 1);
    }
    setState({ attachments: attachmentsCopy });
  },
  onRemove() {},
};

<Upload {...UploadProps} />;
```
