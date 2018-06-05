<template>
  <div class="index">
    <el-upload
      :action="getUpload()"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      list-type="picture-card"
      :file-list="list"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'getLoginStatus'
    ])
  },
  methods: {
    getUpload () {
      return this.$api + '/photo/saveImg'
    },
    handleRemove (file, fileList) {
      axios.post(this.$api + '/photo/delImg', {id: file.id})
        .then(res => {
          if (res.data.code === 0) {
            this.getList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getList () {
      axios.get(this.$api + '/photo/getImg')
        .then(res => {
          if (res.data.code === 0) {
            this.list.splice(0, this.list.length)
            res.data.data.forEach(v => {
              this.list.push({
                id: v.id,
                url: v.img
              })
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleAvatarSuccess (res, file) {
      this.getList()
    },
    beforeAvatarUpload (file) {
      console.log('file', file)
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$msg.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$msg.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    }
  },
  created () {
    this.getList()
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/photo') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.index {
  width: 100%;
  padding: 20px;
  background: #fff;
  height: 100%;
}
</style>
<style>
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
