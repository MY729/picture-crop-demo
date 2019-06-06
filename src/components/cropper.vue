<template>
  <div class="rc-cropper" v-if="data.src">
    <canvas :id="data.src" ref="canvas"></canvas>
    <div class="rc-cropper__iconCrop">
      <el-button type="success" size="small" @click="initCropper()" :disabled="croppShow">裁剪</el-button>
      <el-button type="success" size="small" @click="sureCropper()" v-if="cropper">确认</el-button>
      <el-button type="danger" size="small" @click="cancelCropper()" v-if="cropper">取消</el-button>
    </div>
  </div>
</template>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
export default {
  name: 'cropper',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      cropper: null,
      croppShow: false
    }
  },
  mounted () {
    this.drawImg()
  },
  methods: {
    // 在canvas上绘制图片
    drawImg (href) {
      this.$nextTick(() => {
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
          img.src = href || this.data.src
          img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          }
        }
      })
    },
    // 显示裁剪框
    initCropper () {
      this.drawImg()
      this.croppShow = true
      let cropper = new Cropper(this.$refs.canvas, {
        checkCrossOrigin: true,
        viewMode: 2,
        aspectRatio: 3 / 2
      })
      this.cropper = cropper
    },
    // 确认裁剪
    sureCropper () {
      let _this = this
      this.cropper.getCroppedCanvas().toBlob(function (blob) {
        const href = window.URL.createObjectURL(blob)
        _this.drawImg(href)
      }, 'image/jpeg')
      this.cancelCropper()
    },
    // 销毁裁剪框
    cancelCropper () {
      this.cropper.destroy()
      this.croppShow = false
      this.cropper = null
    }
  }
}
</script>
<style>
.rc-cropper {
  position: relative;
}

img {
  width: 100%;
  height: 100%;
}

.rc-cropper__iconCrop {
  position: absolute;
  right: 4%;
  top: 4%;
}

.el-button {
  margin: 20px 0;
  display: block;
  z-index: 10000;
}
</style>
