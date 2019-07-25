<template>
  <div class="rc-cropper" v-if="data.src">
    <canvas :id="data.src" ref="canvas"></canvas>
    <div class="rc-cropper__iconCrop1">
      <el-tooltip content="裁剪" placement="right">
        <el-button type="primary" size="small" @click="initCropper()" :disabled="croppShow">裁剪</el-button>
      </el-tooltip>
      <el-tooltip content="确认裁剪" placement="right" v-if="cropper">
        <el-button type="success" size="mini" @click="sureCropper()"><i class="el-icon-check"></i></el-button>
      </el-tooltip>
      <el-tooltip content="取消裁剪" placement="right" v-if="cropper">
        <el-button type="danger" size="small" @click="cancelCropper()" v-if="cropper"><i class="el-icon-close"></i></el-button>
      </el-tooltip>
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
          canvas.width = 720
          canvas.height = 480
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

.rc-cropper__iconCrop1 {
  position: absolute;
  right: 4%;
  top: 0%;
}

.el-button {
  margin: 20px 0;
  display: block;
  z-index: 10000;
}
</style>
