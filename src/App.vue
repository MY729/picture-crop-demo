<template>
  <div id="app">
    <h1>vue项目实现图片裁剪功能</h1>
    <el-row>
      <el-col :span="8" :offset="8">
        <h2>使用cropperjs插件实现（一）</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <cropper :data="slide"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <h2>使用cropperjs插件实现（二）</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4">
        <cropper-one :data="slide1"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <h2>使用canvas实现</h2>
        <h3>点击裁剪，鼠标在图片上绘制裁剪区域</h3>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4">
        <cropper-canvas :data="slideCanvas"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cropper from './components/cropper.vue'
import CropperOne from './components/cropper.one.vue'
import CropperCanvas from './components/cropper.canvas.vue'

export default {
  name: 'app',
  components: {
    Cropper,
    CropperOne,
    CropperCanvas
  },
  data () {
    return {
      slide: {
        src: 'https://avatars0.githubusercontent.com/u/26196557?s=460&v=40' // 图片地址
      },
      slide1: {
        src: 'https://avatars3.githubusercontent.com/u/7911342?s=460&v=4' // 图片地址
      },
      slideCanvas: {
        img_url: 'https://avatars1.githubusercontent.com/u/23690568?s=460&v=4',
        src:  'https://avatars1.githubusercontent.com/u/23690568?s=460&v=4'// 图片地址
      }
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
</style>
