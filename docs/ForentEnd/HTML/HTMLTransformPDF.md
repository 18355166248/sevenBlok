# 记录 HTMl 转 PDF 的过程和方法记录 (待完善)

## 1. 准备

这里我用的是 react 方法, 所有使用了有一部分是 react, 不过思想还是用 js+原生实现的

使用插件:

1. lodash 做一些数据的处理和判断
2. html2canvas 合成图片 (核心)
3. jspdf 将图片合成为 PDF (核心)
4. react-to-print 支持 react 的打印功能

<strong>组件设计:</strong>

组件设计的时候, 需要考虑传什么参数, 需要赋予什么事件, 这里我经过总结, 暂时需要以下 props

1. Head: {component} // 头部
2. Foot: {component} // 尾部
3. Content: {component} // 主体
4. height: number // 每页高度
5. width: number // PDF 宽度
6. padding: number // PDF 左右间距
7. renderFinish: func // 虚拟 Dom 渲染完成回调函数
8. finish: func // 生成 PDF 的每页图片渲染完成
9. preview: bool // 是否需要预览
10. setGetPdfCallback: func
11. container: object // 生成 PDF 的每页图片包裹的 Dom 节点
12. virtualClass: string // 虚拟 Dom 的类名, 用来设置 css 样式的包裹器, 避免全局样式污染
13. download: bool // 是否直接下载, 如果设置 true, 那么会直接下载 pdf 文件到本地

## 2. 需求

产品一开始说需求的时候, 希望可以分页, 带页眉, 页尾, 当前页, 中间主体是有表格的, 表格的话, 一行表格可能会很长, 所以要按照每行进行分页
一开始我是按照表格每行进行分页的, 实现很简单, 就是获取所有的 tr 标签, 然后遍历判断是否需要份分页, 然后在如果需要分页, 创建一个新的 table 标签,
appdendChild 进去.

## 3. 实现

不过如果需要按照行进行分页的话, 那难度就增大了. 思考了许久, 决定使用截屏的实现思路:

1. 首先生成一个虚拟 Dom, 将头部, 尾部通过 html2canvas 进行绘图, 中间部分也需要绘图.
2. 需要将中间部分进行截取, 截取的方式就是外面生成一个盒子, overflow: hidden; 把中间部分的截图进行定位, 不同页的定位不同, 从而实现分页功能
3. 中间部分截取, 首先需要给每行加一个公共 class, 最后获取中间部分 Dom 下所有的这个 class dom 集合, 进行遍历
4. 遍历的时候出现过不少 bug, 也就是计算错误! 需要注意的是, 生成的 curContentList 不是按照当前屏幕高度去获取位置, 一定是要按照中间部分的 Dom 进行计算, 实现代码在这里:

```js
const curContentList = [0] // 需要截取位置的缓存
const headerWithFootHeight = headHeight + footHeight + pageHeight // 公共部分的高度
const pdfPageRangeList = contentRef.getElementsByClassName('pdf-page-range') // 获取所有设置公共class的集合
const bodyOffsetTop = contentRef.getBoundingClientRect().top // content盒子距离页面顶部距离

;[...pdfPageRangeList].forEach((pdfPageRange, pdfPageRangeIndex) => {
  const curOffsetTop = pdfPageRange.getBoundingClientRect().top - bodyOffsetTop // 当前盒子距离中间部分dom顶部的距离

  // 这里表示的是中间部分的Dom节点进行计算, 截取位置所在的高度 dom超过这个高度那就应该要换页
  // curContentList[curContentList.length - 1] 表示上一页在Dom节点中所在的位置
  // height - headerWithFootHeight 表示分页后去掉公共区域, 中间部分理论要占的位置
  const curHeightTotal =
    height - headerWithFootHeight + curContentList[curContentList.length - 1]

  if (curOffsetTop >= curHeightTotal) {
    // 换页
    curContentList.push(
      pdfPageRangeList[pdfPageRangeIndex - 1].getBoundingClientRect().top -
        bodyOffsetTop
    )
  }
})
```

5. 缓存头部底部的 base64 图片的数据.
6. 然后需要生成一个 div, 将头部, 底部 , 截取后的中间部分按照分页顺序进行拼接 Dom, 拼接完添加到 body 中
   这里需要注意的是怎么截取公共 content 位置

```js
// content 当前页位于中间页面起始位置, 是数字
// (height - headerWithFootHeight) 每页公共部分理论的高度
// contentList[contentIndex + 1] 下一页的起始位置
// 当前起始位置(content) + (公共理论的高度) - 下一页位于中间页面起始位置 =
// 当前页显示内容高度跟理论高度的差值, 赋值给中间部分的paddingBottom;
const diffNum =
  content + (height - headerWithFootHeight) - contentList[contentIndex + 1]

if (diffNum > 0) {
  contentBox.style.paddingBottom = diffNum + 'px'
}
```

7. 然后将拼接好的 dom 按照分页进行合成图片
8. 将合成后的图片添加到传入组件的 container dom 中进行显示
9. 如果有预览, 那么就设置 setGetPdfCallback
10. 如果没有预览, 就直接返回 pdf 文件数据, 如果这个时候 download 参数为 truem, 那么会直接下载 PDF 文件到本地.

## 4. 方法

1. 将 base64 转换为文件对象

```js
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  //转换成file对象
  return new File([u8arr], filename, { type: mime })
  //转换成成blob对象
  //return new Blob([u8arr],{type:mime});
}
```

2. 因为生成 pdf 过程时间较长, 所有需要暴露出去 2 个方法: 重置和销毁, 当需要销毁进程的时候, 调用 HtmlTransformPDF.stop

当销毁进程后, 确定销毁结束后, 需要重置代码 这个时候需要调用 HtmlTransformPDF.destroy

3. 打印功能因为不同显示器 DPI(图像每英寸长度内的像素点数)不一样, 所有需要计算毫米转像素的方法

```js
function UnitConversion() {
  /**
   * 获取DPI
   * @returns {Array}
   */
  this.conversion_getDPI = function() {
    var arrDPI = new Array()

    if (window.screen.deviceXDPI) {
      arrDPI[0] = window.screen.deviceXDPI
      arrDPI[1] = window.screen.deviceYDPI
    } else {
      var tmpNode = document.createElement('div')

      tmpNode.style.cssText =
        'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
      document.body.appendChild(tmpNode)
      arrDPI[0] = parseInt(tmpNode.offsetWidth)
      arrDPI[1] = parseInt(tmpNode.offsetHeight)
      tmpNode.parentNode.removeChild(tmpNode)
    }

    return arrDPI
  }
  /**
   * px转换为mm
   * @param value
   * @returns {number}
   */
  this.pxConversionMm = function(value) {
    var inch = value / this.conversion_getDPI()[0]
    var c_value = inch * 25.4
    //      console.log(c_value);

    return c_value
  }
  /**
   * mm转换为px
   * @param value
   * @returns {number}
   */
  this.mmConversionPx = function(value) {
    var inch = value / 25.4
    var c_value = inch * this.conversion_getDPI()[0]
    //      console.log(c_value);

    return c_value
  }
}
```

## 5. 代码实现

::: details 点击查看 HtmlTransformPDF

```js
import React, { useEffect, useState } from 'react'
import VirtualDom from './VirtualDom'
import _ from 'lodash'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import PropTypes from 'prop-types'

HtmlTransformPDF.proptypes = {
  Head: PropTypes.any, // 头部
  Foot: PropTypes.any, // 尾部
  Content: PropTypes.any, // 主体
  height: PropTypes.number, // 每页高度
  width: PropTypes.number, // PDF宽度
  padding: PropTypes.number, // PDF左右间距
  renderFinish: PropTypes.func, // 虚拟Dom渲染完成回调函数
  finish: PropTypes.func, // 生成PDF的每页图片渲染完成
  preview: PropTypes.bool, // 是否需要预览
  setGetPdfCallback: PropTypes.func,
  container: PropTypes.object,
  virtualClass: PropTypes.string,
  download: PropTypes.bool
}

function HtmlTransformPDF(props) {
  const {
    Head,
    Foot,
    Content,
    height = 841.89,
    width = 595.28,
    padding,
    renderFinish,
    finish,
    preview = false,
    setGetPdfCallback,
    container,
    virtualClass,
    download
  } = props
  const [domInfo, setDomInfo] = useState(null)
  const [headHeight, setHeadHeight] = useState(0)
  const [footHeight, setFootHeight] = useState(0)
  const [contentList, setContentList] = useState([])
  const [headImg, setHeadImg] = useState('')
  const [footImg, setFootImg] = useState('')
  const pageHeight = 40
  const imagePageDomId = 'imagePageDomId' + new Date().getTime() // 生成dom的Id

  // 获取 Head, Foot, Content 高度
  useEffect(() => {
    if (_.isPlainObject(domInfo)) {
      const { headData, footData, contentData } = domInfo
      const headRef = document.getElementById(headData.id)
      const contentRef = document.getElementById(contentData.id)
      const footRef = document.getElementById(footData.id)
      const headHeight = headRef.offsetHeight
      const footHeight = footRef.offsetHeight
      const curContentList = [0]
      const headerWithFootHeight = headHeight + footHeight + pageHeight

      setHeadHeight(headHeight)
      setFootHeight(footHeight)

      const pdfPageRangeList = contentRef.getElementsByClassName(
        'pdf-page-range'
      )

      const bodyOffsetTop = contentRef.getBoundingClientRect().top // content盒子距离页面顶部距离

      ;[...pdfPageRangeList].forEach((pdfPageRange, pdfPageRangeIndex) => {
        const curOffsetTop =
          pdfPageRange.getBoundingClientRect().top - bodyOffsetTop

        // 这里表示的是排除公共区域, 截取位置所在的高度 dom超过这个高度那就应该要换页
        const curHeightTotal =
          height -
          headerWithFootHeight +
          curContentList[curContentList.length - 1]

        if (curOffsetTop >= curHeightTotal) {
          // 换页
          curContentList.push(
            pdfPageRangeList[pdfPageRangeIndex - 1].getBoundingClientRect()
              .top - bodyOffsetTop
          )
        }
      })

      // 生成头部, 底部图片
      const time = setTimeout(() => {
        html2canvas(document.getElementById(headData.id), {
          scale: 2,
          height: headRef.offsetHeight, // 下面解决当页面滚动之后生成图片出现白边问题
          width: headRef.offsetWidth,
          scrollY: 0
        })
          .then(canvas => {
            if (destroy()) {
              return Promise.reject()
            }

            const contentWidth = canvas.width
            const contentHeight = canvas.height
            const imgWidth = width
            const imgHeight = (width / contentWidth) * contentHeight

            const pageData = canvas.toDataURL('image/jpeg', 1.0)

            setHeadImg({ data: pageData, width: imgWidth, height: imgHeight })
          })
          .catch(err => {
            console.log(err)
          })

        html2canvas(footRef, {
          scale: 2,
          height: footRef.offsetHeight, // 下面解决当页面滚动之后生成图片出现白边问题
          width: footRef.offsetWidth,
          scrollY: 0
        })
          .then(canvas => {
            if (destroy()) {
              return Promise.reject()
            }

            const contentWidth = canvas.width
            const contentHeight = canvas.height
            const imgWidth = width
            const imgHeight = (width / contentWidth) * contentHeight
            const pageData = canvas.toDataURL('image/jpeg', 1.0)

            setFootImg({ data: pageData, width: imgWidth, height: imgHeight })
          })
          .catch(err => {
            console.log(err)
          })
      }, 50)

      if (localStorage.getItem('isStop')) {
        localStorage.setItem('isStop', '')

        clearTimeout(time)

        return
      }

      setContentList(curContentList)
    }
  }, [domInfo, height, width])

  // 监听contentList
  useEffect(() => {
    if (
      contentList.length > 0 &&
      headImg &&
      footImg &&
      !localStorage.getItem('isStop')
    ) {
      _.isFunction(renderFinish) && renderFinish()
      getPDF()
    }
  }, [contentList, headImg, footImg])

  return (
    <VirtualDom
      virtualClass={virtualClass}
      Head={Head}
      Foot={Foot}
      Content={Content}
      width={width}
      padding={padding}
      setDomInfo={setDomInfo}
    />
  )

  // 处理html 按要求拼接
  function getPDF() {
    return new Promise((resolve, reject) => {
      const contentRef = document.getElementById(domInfo.contentData.id)

      html2canvas(contentRef, {
        scale: 2,
        height: contentRef.offsetHeight, // 下面解决当页面滚动之后生成图片出现白边问题
        width: contentRef.offsetWidth,
        scrollY: 0
      })
        .then(canvas => {
          if (destroy()) {
            return
          }

          const headerWithFootHeight = headHeight + footHeight + pageHeight //头部+尾部+页码高度
          const pageData = canvas.toDataURL('image/jpeg', 1.0)
          const imagePagesDom = document.createElement('div')

          imagePagesDom.style.width = width + 'px'
          imagePagesDom.style.position = 'fixed'
          imagePagesDom.style.zIndex = -100
          imagePagesDom.style.backgroundColor = '#fff'
          imagePagesDom.style.top = '0'
          imagePagesDom.style.left = '0'
          imagePagesDom.id = imagePageDomId

          contentList.forEach((content, contentIndex) => {
            const imagBox = document.createElement('div')

            imagBox.style.width = width + 'px'
            imagBox.style.height = height + 'px'
            imagBox.style.paddingLeft = padding + 'px'
            imagBox.style.paddingRight = padding + 'px'
            imagBox.style.backgroundColor = '#fff'
            // imagBox.style.marginBottom = '10px';
            imagBox.innerHTML = ''
            const imgHead = new Image()
            const imgContent = new Image()
            const imgFoot = new Image()

            // 头部图片渲染完成
            imgHead.onload = function() {
              if (destroy()) {
                return
              }

              imagBox.appendChild(imgHead)

              // 中间主题图片渲染完成
              imgContent.onload = function() {
                if (destroy()) {
                  return
                }

                const contentBox = document.createElement('div')

                contentBox.style.width = '100%'
                contentBox.style.height = height - headerWithFootHeight + 'px'

                const contentBoxChild = document.createElement('div')

                contentBoxChild.style.width = '100%'
                contentBoxChild.style.position = 'relative'

                const diffNum =
                  content +
                  (height - headerWithFootHeight) -
                  contentList[contentIndex + 1]

                if (diffNum > 0) {
                  contentBox.style.paddingBottom = diffNum + 'px'
                }

                contentBoxChild.style.height = '100%'
                contentBoxChild.style.overflow = 'hidden'
                contentBoxChild.appendChild(imgContent)
                contentBox.style.overflow = 'hidden'
                contentBox.appendChild(contentBoxChild)
                imgContent.style.position = 'absolute'
                imgContent.style.left = 0
                imgContent.style.top = -content + 'px'
                imagBox.appendChild(contentBox)

                // 底部图片渲染完成
                imgFoot.onload = function() {
                  if (destroy()) {
                    return
                  }

                  imagBox.appendChild(imgFoot)

                  const pageBox = document.createElement('div')
                  const pageTextDom = document.createElement('span')
                  const curPageDom = document.createElement('span')
                  const splitLineDom = document.createElement('span')
                  const totalPageDom = document.createElement('span')

                  pageTextDom.innerText = 'Page '
                  curPageDom.innerText = contentIndex + 1
                  splitLineDom.innerText = '/'
                  totalPageDom.innerText = contentList.length

                  pageBox.style.height = pageHeight + 'px'
                  pageBox.style.lineHeight = pageHeight + 'px'
                  pageBox.style.textAlign = 'center'
                  pageBox.style.fontWeight = '700'

                  pageBox.appendChild(pageTextDom)
                  pageBox.appendChild(curPageDom)
                  pageBox.appendChild(splitLineDom)
                  pageBox.appendChild(totalPageDom)

                  imagBox.appendChild(pageBox)
                  // 添加底部page/total
                  imagePagesDom.appendChild(imagBox)
                }
              }
            }

            imgHead.src = headImg.data
            imgHead.style.width = '100%'
            imgContent.src = pageData
            imgContent.style.width = '100%'
            imgFoot.src = footImg.data
            imgFoot.style.width = '100%'
          })

          document.body.appendChild(imagePagesDom)

          createPDFPreview()
            .then(({ imgDomList, imgList }) => {
              if (destroy()) {
                return
              }

              container.current
                ? container.current.appendChild(imgDomList)
                : document.body.appendChild(imgDomList)

              // 如果有预览, 那么就设置setGetPdfCallback
              if (preview) {
                setGetPdfCallback(() => {
                  return () => createPDF(imgList)
                })
                _.isFunction(finish) && finish()

                return
              }

              // 如果没有预览, 就直接返回pdf文件数据
              _.isFunction(finish) && finish(createPDF(imgList))
            })
            .finally(() => {
              localStorage.setItem('isStop', '')

              if (imagePagesDom.parentNode) {
                imagePagesDom.parentNode.removeChild(imagePagesDom)
              }
            })
            .catch(err => {
              return Promise.reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  // 生成pdf预览文件
  function createPDFPreview() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const imagePageDom = document.getElementById(imagePageDomId)
        const ImagePageDomChildren = imagePageDom.children
        const html2canvasList = []

        ;[...ImagePageDomChildren].forEach(ImagePageDomChild => {
          html2canvasList.push(
            html2canvas(ImagePageDomChild, {
              scale: 2,
              width: ImagePageDomChild.offsetWidth,
              height: ImagePageDomChild.offsetHeight,
              scrollY: 0
            })
          )
        })

        Promise.all(html2canvasList)
          .then(imgList => {
            if (destroy()) {
              return
            }

            let num = 0
            const imgDomList = document.createElement('div')

            imgDomList.style.width = width + 'px'
            imgDomList.style.backgroundColor = '#ccc'

            imgList.forEach((canvas, canvasIndex) => {
              const pageData = canvas.toDataURL('image/jpeg', 1.0)
              const previewImage = new Image()

              previewImage.onload = function() {
                if (destroy()) {
                  return
                }

                num++

                imgDomList.appendChild(previewImage)

                if (num === imgList.length) {
                  // 加载完成
                  resolve({ imgDomList, imgList })
                }
              }
              previewImage.src = pageData
              previewImage.style.width = '100%'

              if (canvasIndex < imgList.length - 1) {
                // previewImage.style.marginBottom = '10px';
              }
            })
          })
          .catch(err => {
            reject(err)
          })
      }, 50)
    })
  }

  function createPDF(imgList) {
    const pdf = new jsPDF('', 'pt')

    imgList.forEach((canvas, canvasIndex) => {
      const contentWidth = canvas.width
      const contentHeight = canvas.height
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      const imgWidth = width
      const imgHeight = (width / contentWidth) * contentHeight

      pdf.addImage(canvas, 'JPEG', 0, 0, imgWidth, imgHeight)

      if (canvasIndex < imgList.length - 1) {
        pdf.addPage()
      }
    })

    if (download) {
      pdf.save(new Date().getTime() + '.pdf')

      return
    }

    const fileString = pdf.output('dataurlstring')

    const file = dataURLtoFile(fileString, new Date().getTime())

    return file
  }

  //将base64转换为文件对象
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    //转换成file对象
    return new File([u8arr], filename, { type: mime })
    //转换成成blob对象
    //return new Blob([u8arr],{type:mime});
  }

  function destroy() {
    if (localStorage.getItem('isStop')) {
      localStorage.setItem('isStop', '')

      console.log('destroy')

      const imagePageDom = document.getElementById(imagePageDomId)

      if (imagePageDom && imagePageDom.parentNode) {
        imagePageDom.parentNode.removeChild(imagePageDom)
      }

      return true
    }

    return false
  }
}

// 执行此方法, 生成PDF流程会强制停止
HtmlTransformPDF.stop = function() {
  localStorage.setItem('isStop', 1)
}

// 执行此方法, 会重置状态, 在执行完stop方法后, 适当的时机需要执行此方法, 重置状态
HtmlTransformPDF.destroy = function() {
  localStorage.setItem('isStop', '')
}

export default HtmlTransformPDF
```

:::

::: details 点击查看 VirtualDom

```js
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function VirtualDom(props) {
  let { Head, Foot, Content, width, padding, setDomInfo, virtualClass } = props

  const headId = useRef('head' + new Date().getTime())

  const contentId = useRef('content' + new Date().getTime())

  const footId = useRef('foot' + new Date().getTime())

  useEffect(() => {
    setDomInfo({
      headData: {
        id: headId.current
      },
      contentData: {
        id: contentId.current
      },
      footData: {
        id: footId.current
      }
    })
  }, [])

  return createPortal(
    <div
      className={virtualClass}
      style={{
        width: width + 'px',
        padding: padding + 'px',
        position: 'fixed',
        left: '9999px',
        top: '9999px',
        zIndex: 1,
        opacity: '0'
      }}
    >
      <Head id={headId.current} />
      <Content id={contentId.current} />
      <Foot id={footId.current} />
    </div>,
    document.body
  )
}

export default VirtualDom
```

:::

## 6. 使用

```js
const unit = new UnitConversion()

function TransformPDF(props) {
  const {
    registerPatientStore,
    electronicMedicalRecordStore,
    data,
    langStore,
    visible,
    setVisible,
    getFormValue,
    print
  } = props
  const { medicalRecordInfo } = electronicMedicalRecordStore
  const { patientInfo } = registerPatientStore
  const [getPdfCallback, setGetPdfCallback] = useState(() => {})
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(true)
  const container = useRef(null)
  const modalWidth = unit.mmConversionPx(210)

  useEffect(() => {
    HtmlTransformPDF.destroy()

    return () => {
      setLoading(true)
      setSpinning(true)
    }
  }, [])

  useEffect(() => {
    if (visible) {
      HtmlTransformPDF.destroy()
    }
  }, [visible])

  if (!data) {
    return null
  }

  const {
    patient,
    deptInfo,
    doctor,
    patientAllergyRecordList,
    medicalHistory,
    diagnosisTreatmentPlanList,
    createFileTime
  } = data

  const Header = function(props) {
    return ()
  }

  const Footer = function(props) {
    return ()
  }

  const Content = function(props) {
    return ()
  }

  return (
    <Modal
      width={modalWidth + 20}
      className={styles.transformPDF}
      title={electronicMedicalRecordLang.medicalRecordSubmission(
        langStore.lang
      )}
      visible={visible}
      onOk={submit}
      onCancel={closeModal}
      confirmLoading={loading}
    >
      <Spin
        spinning={spinning}
        style={{ width: '100%', height: '200px', lineHeight: '200px' }}
      />
      <div
        ref={container}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {data && (
          <HtmlTransformPDF
            width={modalWidth}
            height={Math.ceil(unit.mmConversionPx(296))}
            virtualClass="transformPDF"
            container={container}
            padding={20}
            Head={Header}
            Foot={Footer}
            Content={Content}
            renderFinish={renderFinish}
            finish={finish}
            setGetPdfCallback={setGetPdfCallback}
          />
        )}
      </div>
    </Modal>
  )

  function renderFinish() {
    console.log('renderFinish')
  }

  function finish(file) {
    console.log('finish', file)
    setLoading(false)
    setSpinning(false)
  }

  function submit() {
    if (print) {
      onPrint()

      return
    }

    submitMedicalRecord()
  }

  function submitMedicalRecord() {
    setLoading(true)
    const file = getPdfCallback()
  }

  function closeModal() {
    setLoading(true)
    setSpinning(true)
    setGetPdfCallback(() => {})
    HtmlTransformPDF.stop()
    setVisible(false)
  }

  function onPrint() {
    reactToPrint({
      content: () => container.current.firstElementChild,
      onAfterPrint: () => {
        // closeModal();
      }
    })
  }
}
```
