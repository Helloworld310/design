<template>
  <div class="not">
    <el-button @click="back" type="primary">返回首页</el-button>
    <h1>404 Not Found!</h1>
  </div>
</template>
<script>
export default {
  methods: {
    back () {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped>
.not {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
  padding-top: 100px;
  h1 {
    margin-top: 30px;
  }
}
</style>
