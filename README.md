# picture-crop-demo
> 在vue项目中实现图片裁剪功能

## 演示地址

[https://my729.github.io/picture-crop-demo/dist/index.html](https://my729.github.io/picture-crop-demo/dist/index.html)

## 前言

* vue版本：3.6.3 [https://cli.vuejs.org/zh/](https://cli.vuejs.org/zh/)
* cropperjs: 1.5.1 [https://github.com/fengyuanchen/cropperjs](https://github.com/fengyuanchen/cropperjs)  
* elementUI  [https://element.eleme.io/#/zh-CN](https://element.eleme.io/#/zh-CN)

> 使用 cropperjs插件 和 原生canvas 两种方式实现图片裁剪功能

## 使用cropperjs插件

### 安装cropperjs
``` bash
yarn install cropperjs
```

##  初始化一个canvas元素，并在上面绘制图片

```html
<canvas :id="data.src" ref="canvas"></canvas>
```

``` js
// 在canvas上绘制图片
drawImg () {
  this.$nextTick(() => {
    // 获取canvas节点
    let canvas = document.getElementById(this.data.src)
    if (canvas) {
      // 设置canvas的宽为canvas的父元素宽度，宽高比3:2
      let parentEle = canvas.parentElement
      canvas.width = parentEle.offsetWidth
      canvas.height = 2 * parentEle.offsetWidth / 3
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = this.data.src
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    }
  })
}
```
> 如果遇到canvas跨域绘制图片报错，设置图片img.crossOrigin = 'Anonymous'，并且服务器响应头设置Access-Control-Allow-Origin：*


### 创建cropperjs
```js
// 引入
import Cropper from 'cropperjs'

// 显示裁剪框
initCropper () {
  let cropper = new Cropper(this.$refs.canvas, {
    checkCrossOrigin: true,
    viewMode: 2,
    aspectRatio: 3 / 2
  })
}
```
> 更多方法和属性，参考官网： [https://github.com/fengyuanchen/cropperjs](https://github.com/fengyuanchen/cropperjs)

具体实现，可以查看源码的`cropper.vue` 或 `cropper.one.vue`组件:

`cropper.vue组件：`https://github.com/MY729/picture-crop-demo/blob/master/src/components/cropper.vue  
`cropper.one.vue组件：`https://github.com/MY729/picture-crop-demo/blob/master/src/components/cropper.one.vue
`cropper.two.vue组件：`https://github.com/MY729/picture-crop-demo/blob/master/src/components/cropper.two.vue

## 使用canvas实现图片裁剪

> 支持鼠标绘制裁剪框，并移动裁剪框

#### 思路：
* 在canvas上绘制图片为背景  
* 监听鼠标点击、移动、松开事件

> canvas的isPointInPath()方法：
> 如果给定的点的坐标位于路径之内的话（包括路径的边）,否则返回 false

具体实现可查看源码`cropper.canvas.vue组件`: https://github.com/MY729/picture-crop-demo/blob/master/src/components/cropper.canvas.vue

```js
cropImg () {
  let canvas = document.getElementById(this.data.img_url)
  let ctx = canvas.getContext('2d')
  let img = new Image()
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
  img.src = this.data.src
  let drag = false // 是否拖动矩形
  let flag = false // 是否绘制矩形
  let rectWidth = 0 // 绘制矩形的宽
  let rectHeight = 0 // 绘制矩形的高
  let clickX = 0 // 矩形开始绘制X坐标
  let clickY = 0 // 矩形开始绘制Y坐标
  let dragX = 0 // 当要拖动矩形点击时X坐标
  let dragY = 0 // 当要拖动矩形点击时Y坐标
  let newRectX = 0 // 拖动变化后矩形开始绘制的X坐标
  let newRectY = 0 // 拖动变化后矩形开始绘制的Y坐标
  // 鼠标按下
  canvas.onmousedown = e => {
    // 每次点击前如果有绘制好的矩形框，通过路径绘制出来，用于下面的判断
    ctx.beginPath()
    ctx.setLineDash([6, 6])
    ctx.moveTo(newRectX, newRectY)
    ctx.lineTo(newRectX + rectWidth, newRectY)
    ctx.lineTo(newRectX + rectWidth, newRectY + rectHeight)
    ctx.lineTo(newRectX, newRectY + rectHeight)
    ctx.lineTo(newRectX, newRectY)
    ctx.strokeStyle = 'green'
    ctx.stroke()
    // 每次点击，通过判断鼠标点击的点在矩形框内还是外，来决定重新绘制还是移动矩形框
    if (ctx.isPointInPath(e.offsetX, e.offsetY)) {
      drag = true
      dragX = e.offsetX
      dragY = e.offsetY
      clickX = newRectX
      clickY = newRectY
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      flag = true
      clickX = e.offsetX
      clickY = e.offsetY
      newRectX = e.offsetX
      newRectY = e.offsetY
    }
  }
  // 鼠标抬起
  canvas.onmouseup = () => {
    if (flag) {
      flag = false
      this.sureCrop(clickX, clickY, rectWidth, rectHeight)
    }
    if (drag) {
      drag = false
      this.sureCrop(newRectX, newRectY, rectWidth, rectHeight)
    }
  }
  // 鼠标移动
  canvas.onmousemove = (e) => {
    if (flag) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      rectWidth = e.offsetX - clickX
      rectHeight = e.offsetY - clickY

      ctx.beginPath()
      ctx.strokeStyle = '#FF0000'
      ctx.strokeRect(clickX, clickY, rectWidth, rectHeight)
      ctx.closePath()
    }
    if (drag) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      newRectX = clickX + e.offsetX - dragX
      newRectY = clickY + e.offsetY - dragY
      ctx.strokeStyle = 'yellow'
      ctx.strokeRect(newRectX, newRectY, rectWidth, rectHeight)
      ctx.closePath()
    }
  }
},
// 拿到裁剪后的参数，可自行处理图片
sureCrop (x, y, width, height) {
  let canvas = document.getElementById(this.data.img_url + 'after')
  // 设置canvas的宽为canvas的父元素宽度，宽高比3:2
  let parentEle = canvas.parentElement
  canvas.width = parentEle.offsetWidth
  canvas.height = 2 * parentEle.offsetWidth / 3
  let ctx = canvas.getContext('2d')
  let img = new Image()
  img.src = this.data.src
  img.onload = function () {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.lineTo(x + width, y + height)
    ctx.lineTo(x, y + height)
    ctx.clip()
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
  ctx.stroke()
}
```

#### 可以直接clone项目，本地运行查看代码和效果

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```
### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
