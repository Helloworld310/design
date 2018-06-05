<template>
  <div id="app">
    <div class="header"></div>
    <div class="app-content">
    <side-bar></side-bar>
    <div class="overview">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    </div>
    <div class="footer">
      <p>Copyright © 2017 LittleBitch - 粤ICP备 17071196 号</p>
    </div>
  </div>
</template>

<script>
import OverView from './components/OverView'
import SideBar from './components/SideBar'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  components: {
    SideBar,
    OverView
  }
}
</script>

<style lang="less">
@import 'less/normalize.less';
body {
  background: #F0F0F0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 20px auto 0;
  min-width: 1200px;
  .app-content {
    width: 1150px;
    display: flex;
    margin: 0 auto;
  }
  .overview {
    width: 860px;
    min-height: 1000px;
    // overflow: hidden;
    margin-left: 20px;
    margin-bottom: 20px;
    // background: #fff;
  }
  .footer {
    background-color: #2B3D4F;
    width: 100%;
    height: 70px;
    line-height: 70px;
    margin-top: 80px;
    p {
      color: #fff;
      margin: 0;
    }
  }
}
</style>
<style>
.el-message {
  top: 120px!important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
