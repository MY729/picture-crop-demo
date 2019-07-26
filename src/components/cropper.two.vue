<template>
  <div class="rc-cropper" v-if="originImg">
    <el-row>
      <el-col :span="12">
        <div class="rc-cropper__canvasCrop2">
          <img :src="originImg" v-if="!cropper">
          <canvas :id="originImg" ref="canvas"/>
          <div class="rc-cropper__iconCrop">
            <el-tooltip content="确认裁剪" placement="right" v-if="cropper">
              <el-button type="success" size="mini" @click="sureCropper()"><i class="el-icon-check"></i></el-button>
            </el-tooltip>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="rc-cropper__previewImg">
          <img :src="previewImg" id="previewImg"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
export default {
  name: 'rc-cropper2',
  props: {
    cropOption: {
      type: Object,
      required: true,
      default: () => {}
    },
    originImg: {
      required: true
    },
    previewImg: {
      type: String
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
    drawImg () {
      const _this = this
      this.$nextTick(() => {
        let canvas = document.getElementById(this.originImg)
        if (canvas) {
          canvas.width = 720
          canvas.height = 480
          let ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          let img = new Image()
          img.crossOrigin = 'Anonymous'
          img.src = this.originImg
          img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            _this.initCropper()
          }
        }
      })
    },
    // 显示裁剪框
    initCropper () {
      this.croppShow = true
      this.cropper = new Cropper(this.$refs.canvas, {
        checkCrossOrigin: true,
        viewMode: 3,
        zoomOnWheel: false, // 是否可以通过移动鼠标来放大图像
        aspectRatio: 3 / 2,
        ready: () => {
          this.cropper.setData({
            x: this.cropOption.offset_x,
            y: this.cropOption.offset_y,
            width: this.cropOption.width,
            height: this.cropOption.height
          })
        }
      })
      // this.cropper = cropper
    },
    // 确认裁剪
    sureCropper () {
      let _this = this
      const cropParam = this.cropper.getData()
      this.cropper.getCroppedCanvas().toBlob(function (blob) {
        let oFileReader = new FileReader()
        oFileReader.onloadend = function (e) {
          let base64 = e.target.result
          _this.$emit('getCropImg', base64, cropParam)
        }
        oFileReader.readAsDataURL(blob)
      }, 'image/jpeg')
    }
  }
}
</script>
<style>
.rc-cropper {
  position: relative;
  margin-top: 20px;
}

img {
  width: 100%;
  height: 100%;
}

.rc-cropper__canvasCrop2 {
  width: 720px;
  height: 480px;
}

.rc-cropper__iconCrop {
  position: absolute;
  left: 45%;
  top: 0%;
}

.el-tooltip {
  margin: 20px 4px;
  display: block;
  z-index: 10000;
}

.rc-cropper__previewImg {
  width: 600px;
  height: 400px;
}
</style>
