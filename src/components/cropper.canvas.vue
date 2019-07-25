<template>
  <div class="rc-cropper-canvas">
    <el-col :span="12">
      <canvas :id="data.img_url"></canvas>
      <el-button type="danger" size="small" @click="cropImg()" class="rc-crop__iconCropCanvas">裁剪</el-button>
    </el-col>
    <el-col :span="12">
      <canvas :id="data.img_url + 'after'"></canvas>
    </el-col>
  </div>
</template>
<script>
export default {
  name: 'cropper-canvas',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  mounted () {
    this.drawImg()
  },
  methods: {
    drawImg () {
      this.$nextTick(() => {
        let canvas = document.getElementById(this.data.img_url)
        if (canvas) {
          canvas.width = 460
          canvas.height = 460
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
    },
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
        ctx.beginPath()
        ctx.setLineDash([6, 6])
        ctx.moveTo(newRectX, newRectY)
        ctx.lineTo(newRectX + rectWidth, newRectY)
        ctx.lineTo(newRectX + rectWidth, newRectY + rectHeight)
        ctx.lineTo(newRectX, newRectY + rectHeight)
        ctx.lineTo(newRectX, newRectY)
        ctx.strokeStyle = 'green'
        ctx.stroke()
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
  }
}
</script>
<style>
.rc-cropper-canvas {
  position: relative;
}

img {
  width: 100%;
  height: 100%;
}

.rc-crop__iconCropCanvas {
  position: absolute;
  left: 44%;
  top: 4%;
}

.el-button {
  margin: 20px 0;
  display: block;
  z-index: 10000;
}
</style>