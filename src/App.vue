<template>
  <div id="app">
    <h1>vue项目实现图片裁剪功能</h1>
    <el-tabs type="border-card" class="tabs" v-model="activeName">
      <el-tab-pane label="使用cropperjs插件实现（一）" name="first">
        <div class="crop1">
          <cropper :data="slide"/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="使用cropperjs插件实现（二）" name="second">
        <cropper-one :data="slide1"/>
      </el-tab-pane>
      <el-tab-pane label="使用cropperjs插件实现（三）" name="third">
        <h2>可以回显裁剪框并获取裁剪后的数据</h2>
        <cropper-two v-if="activeName === 'third'" :cropOption="cropOption" @getCropImg="getCropImg(arguments)" :originImg="slide2.oriUrl" :previewImg="slide2.preUrl"/>
        <h2>裁剪后的数据：</h2>
        <div>{{cropData}}</div>
      </el-tab-pane>
      <el-tab-pane label="使用canvas实现" name="fourth">
        <h2>点击裁剪绘制裁剪区域</h2>
        <cropper-canvas :data="slideCanvas"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Cropper from './components/cropper.vue'
import CropperOne from './components/cropper.one.vue'
import CropperTwo from './components/cropper.two.vue'
import CropperCanvas from './components/cropper.canvas.vue'

export default {
  name: 'app',
  components: {
    Cropper,
    CropperOne,
    CropperTwo,
    CropperCanvas
  },
  data () {
    return {
      activeName: 'first',
      slide: {
        src: 'https://avatars0.githubusercontent.com/u/26196557?s=460&v=40' // 图片地址
      },
      slide1: {
        src: 'https://avatars3.githubusercontent.com/u/7911342?s=460&v=4' // 图片地址
      },
      cropOption: {
        offset_x: 30,
        offset_y: 40,
        width: 600,
        height: 400
      },
      slide2: {
        oriUrl: 'https://avatars1.githubusercontent.com/u/23690568?s=460&v=4', // 原图
        preUrl: 'https://avatars1.githubusercontent.com/u/23690568?s=460&v=4' // 裁剪后的预览图片，初始化为原图
      },
      cropData: null,
      slideCanvas: {
        img_url: 'https://avatars3.githubusercontent.com/u/44808093?s=460&v=4',
        src:  'https://avatars3.githubusercontent.com/u/44808093?s=460&v=4'// 图片地址
      }
    }
  },
  methods: {
    getCropImg (argument) {
      this.slide2.preUrl = argument[0]
      this.cropData = argument[1]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tabs {
  width: 80%;
  margin: 0 auto;
}

.crop1 {
  width: 720px;
  height: 480px;
}
</style>
