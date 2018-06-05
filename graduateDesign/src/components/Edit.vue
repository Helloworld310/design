<template>
  <div class="index">
    <h3>日志编写</h3>
    <div class="title">
      <el-row>
        <el-col :span="3">
          <label>日志标题</label>
        </el-col>
        <el-col :span="19" :offset="1">
          <el-input v-model="title" placeholder="请输入日志标题"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="title description">
      <el-row>
        <el-col :span="3">
          <label>日志简介</label>
        </el-col>
        <el-col :span="19" :offset="1">
          <el-input type="textarea" v-model="description" placeholder="请输入日志简介" resize="none"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="title">
      <el-row>
        <el-col :span="3">
          <label>日志封面</label>
        </el-col>
        <el-col>
          <el-upload
            class="avatar-uploader avatar-list"
            :action="getUpload()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div id="editor"></div>
    <div class="btn">
      <button @click="save">保存</button>
      <button @click="truncate">清空</button>
      <button @click="push">预发布日志</button>
    </div>
    <div class="notice">
      <h3>公告编写</h3>
      <div class="title">
        <el-row>
          <el-col :span="3">
            <label>公告标题</label>
          </el-col>
          <el-col :span="19" :offset="1">
            <el-input v-model="noticeTitle" placeholder="请输入公告标题"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="title description">
        <el-row>
          <el-col :span="3">
            <label>公告内容</label>
          </el-col>
          <el-col :span="19" :offset="1">
            <el-input type="textarea" v-model="noticeContent" placeholder="请输入公告内容"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="btn">
        <button @click="saveNotice">保存</button>
        <button @click="truncateNotice">清空</button>
        <button @click="pushNotice">发布</button>
      </div>
    </div>
    <div class="album">
      <h3>相册编辑</h3>
      <div class="title">
        <el-row>
          <el-col :span="3">
            <label>相册封面</label>
          </el-col>
          <el-col :span="19" :offset="1" style="text-align: center">
            <el-upload
              class="avatar-uploader avatar-list"
              :action="getUpload()"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="pictureAvatar" :src="pictureAvatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="input">
              <el-input v-model="pictureTitle" placeholder="请输入相册标题" style="width: 26.5%"></el-input>
            </div>
            <el-upload
              class="avatar-uploader"
              :action="getUpload()"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              list-type="picture-card"
              :file-list="pictureList">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <div class="btn album-btn">
        <button @click="saveAlbum">保存</button>
        <button @click="truncateAlbum">清空</button>
        <button @click="pushAlbum">发布</button>
      </div>
    </div>
  </div>
</template>
<script>
import WangEditor from 'wangeditor'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
var editor = {}
export default {
  data () {
    return {
      title: '',
      description: '',
      imageUrl: '',
      noticeTitle: '',
      noticeContent: '',
      pictureTitle: '',
      pictureAvatar: '',
      pictures: '',
      pictureList: []
    }
  },
  computed: {
    ...mapGetters([
      'getLoginStatus'
    ])
  },
  methods: {
    ...mapActions([
      'changeUpdate'
    ]),
    getUpload () {
      return this.$api + '/photo/saveImg'
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 0) {
        this.imageUrl = res.image_url
      }
    },
    handleAvatarSuccess2 (res, file) {
      if (res.code === 0) {
        this.pictureAvatar = res.image_url
      }
    },
    handleAvatarSuccess3 (res, file) {
      if (res.code === 0) {
        this.pictureList.push({
          index: this.pictureList.length,
          url: res.image_url
        })
      }
    },
    handleRemove (file, fileList) {
      this.pictureList.splice(file.index, 1)
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
    },
    getPictureList () {
      axios.get(this.$api + '/album/list')
        .then(res => {
          if (res.data.code === 0) {
            this.pictureList.splice(0, this.pictureList.length)
            this.pictureTitle = res.data.data.title
            this.pictureAvatar = res.data.data.avatar
            if (!res.data.data.pictures.length) return
            (JSON.parse(res.data.data.pictures)).forEach((v, i) => {
              this.pictureList.push({
                index: i,
                url: v.url
              })
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveAlbum () {
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: this.pictureTitle,
        time: time,
        avatar: this.pictureAvatar,
        pictures: this.pictureList
      }
      let url = this.$api + '/album/save'
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '保存成功',
              type: 'success',
              center: true
            })
            this.getPictureList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    truncateAlbum () {
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: '',
        time: time,
        avatar: '',
        pictures: []
      }
      let url = this.$api + '/album/save'
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '清空成功',
              type: 'success',
              center: true
            })
            this.getPictureList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    save () {
      let content = editor.txt.html()
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: this.title,
        description: this.description,
        time: time,
        content: content,
        img: this.imageUrl
      }
      let url = this.$api + '/article/save'
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '保存成功',
              type: 'success',
              center: true
            })
            this.getList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    truncate () {
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: '',
        description: '',
        time: time,
        content: '',
        img: ''
      }
      let url = this.$api + '/article/save'
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '清空成功',
              type: 'success',
              center: true
            })
            this.getList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    pushAlbum () {
      let url = this.$api + '/album/push'
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: this.pictureTitle,
        time: time,
        avatar: this.pictureAvatar,
        pictures: this.pictureList
      }
      if (this.pictureTitle === '') {
        this.$msg({
          message: '相册标题不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      if (this.pictureAvatar === '') {
        this.$msg({
          message: '相册封面不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      if (!this.pictureList.length) {
        this.$msg({
          message: '相册内容不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '发布成功',
              type: 'success',
              center: true
            })
            this.getPictureList()
            this.changeUpdate({isUpdate: true})
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    push () {
      let url = this.$api + '/article/prePush'
      let content = editor.txt.html()
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: this.title,
        description: this.description,
        time: time,
        img: this.imageUrl,
        content: content
      }
      if (this.title === '') {
        this.$msg({
          message: '日志标题不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      if (this.description === '') {
        this.$msg({
          message: '日志简介不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      if (content === '<p><br></p>') {
        this.$msg({
          message: '日志内容不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '预发布成功',
              type: 'success',
              center: true
            })
            this.getList()
            this.changeUpdate({isUpdate: true})
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getList () {
      let url = this.$api + '/article/edit'
      axios.get(url)
        .then(res => {
          if (res.data.code === 0 && res.data.data.length !== 0) {
            let form = res.data.data[0]
            this.title = form.title
            this.description = form.description
            this.imageUrl = form.img
            editor.txt.html(form.content)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveNotice () {
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: this.noticeTitle,
        content: this.noticeContent,
        time: time,
        status: 'edit'
      }
      axios.post(this.$api + '/notice/save', params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '保存成功',
              type: 'success',
              center: true
            })
            this.getNoticeList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getNoticeList () {
      axios.get(this.$api + '/notice/edit')
        .then(res => {
          if (res.data.code === 0) {
            this.noticeTitle = res.data.data.title
            this.noticeContent = res.data.data.content
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    pushNotice () {
      let url = this.$api + '/notice/push'
      let title = this.noticeTitle
      let content = this.noticeContent
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: title,
        time: time,
        content: content
      }
      if (title === '') {
        this.$msg({
          message: '公告标题不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      if (content === '') {
        this.$msg({
          message: '公告内容不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '发布成功',
              type: 'success',
              center: true
            })
            this.getNoticeList()
            this.changeUpdate({isUpdate: true})
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    truncateNotice () {
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let params = {
        title: '',
        content: '',
        time: time,
        status: 'edit'
      }
      let url = this.$api + '/notice/save'
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '清空成功',
              type: 'success',
              center: true
            })
            this.getNoticeList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    editor = new WangEditor('#editor')
    editor.customConfig.pasteFilterStyle = false
    editor.customConfig.uploadImgShowBase64 = true
    editor.customConfig.zIndex = 100
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.create()
    if (this.getLoginStatus) {
      this.getList()
    }
  },
  watch: {
    '$route' (to, form) {
      if (to.path === '/edit' && !this.getLoginStatus) {
        this.$router.push('/')
      } else if (to.path === '/edit' && this.getLoginStatus) {
        this.getList()
        this.getNoticeList()
        this.getPictureList()
      }
    }
  },
  created () {
    if (!this.getLoginStatus) {
      this.$router.push('/')
    }
    this.getNoticeList()
    this.getPictureList()
  }
}
</script>
<style lang="less" scoped>
.index {
  width: 100%;
  padding: 10px;
  // min-height: 100%;
  overflow: hidden;
  background-color: #fff;
}
.index .title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin: 0 10px 10px;
  label {
    display: inline-block;
    font-weight: bold;
    font-size: 18px;
  }
}
.index .btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 30px;
}
.index .btn button {
  width: 100px;
  height: 35px;
  background-color: #409EFF;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}
#editor {
  margin-top: 30px;
}
.album {
  .input {
    margin: 10px 0 20px 0;
  }
  .upload-list {
    margin-bottom: 20px;
  }
  .album-btn {
    margin-top: 400px;
    display: block;
    button {
      margin-right: 200px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
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
.avatar-list .el-icon-plus {
  line-height: 178px!important;
}
</style>
