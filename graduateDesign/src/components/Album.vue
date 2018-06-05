<template>
  <div class="index">
    <div class="album" v-if="display === 'list'">
      <div class="album-list" v-for="(item, i) in albumList" :key="'album' + i">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.avatar" class="image">
          <div style="padding: 14px;">
            <span>{{item.title}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.time }}</time>
              <el-button type="text" class="button" @click="check(i)">查看</el-button>
            </div>
            <div class="bottom clearfix" v-show="getLoginStatus">
              <el-button type="text" class="button" @click="reEdit(i)" style="margin-left: 20px">重新编辑</el-button>
              <el-button type="text" class="button" @click="del(i)">删除</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div v-else-if="display === 'detail'">
      <div class="detail-btn">
        <el-button type="primary" @click="back">返回</el-button>
      </div>
      <div class="album-detail">
        <div class="album" v-for="(item, j) in pictures" :key="'pictures' + j">
          <div class="album-list" >
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.url" class="image">
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div class="re-edit" v-else-if="display === 'reEdit'">
      <div class="album-edit">
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
              <div class="btn album-btn">
                <button @click="back">返回</button>
                <button @click="saveAlbum">保存</button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      display: 'list',
      id: '',
      albumList: [],
      pictures: [],
      pictureAvatar: '',
      pictureTitle: '',
      pictureList: []
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
      this.pictureList.splice(0, this.pictureList.length)
      this.pictureList = fileList.slice()
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
    getList () {
      this.display = 'list'
      axios.post(this.$api + '/album/pictures')
        .then(res => {
          if (res.data.code === 0) {
            this.albumList = res.data.data.albums
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    check (i) {
      axios.post(this.$api + '/album/detail', {id: this.albumList[i].id})
        .then(res => {
          if (res.data.code === 0) {
            this.pictures.splice(0, this.pictures.length)
            this.display = 'detail'
            if (!res.data.data.pictures.length) return
            this.pictures = JSON.parse(res.data.data.pictures)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    back () {
      this.getList()
    },
    del (i) {
      this.$confirm('确定删除该相册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios.post(this.$api + '/album/del', {id: this.albumList[i].id})
            .then(res => {
              if (res.data.code === 0) {
                this.getList()
                this.$msg({
                  message: '删除成功',
                  type: 'success',
                  center: true
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    reEdit (i) {
      this.id = this.albumList[i].id
      this.display = 'reEdit'
      axios.post(this.$api + '/album/reEdit', {id: this.albumList[i].id})
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
            console.log(res)
            console.log(this.pictureList)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    saveAlbum () {
      let url = this.$api + '/album/saveReEdit'
      let date = new Date()
      let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      console.log('picture', this.pictureList)
      let params = {
        id: this.id,
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
      this.$confirm('确定保存该相册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
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
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getList()
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/album' && this.display === 'list') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.index {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
}
.album-detail {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.detail-btn {
  padding: 15px 0 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.album {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.album-list {
  display: flex;
  padding: 10px;
  text-align: left;
  margin-top: 15px;
  margin-left: 32px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  display: block;
  width: 220px;
  height: 220px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}
.re-edit {
  overflow: hidden;
  .album-edit {
    float: left;
  }
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
.index .re-edit h3 {
  width: 100%;
  display: block;
  text-align: center;
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
.album {
  .input {
    margin: 10px 0 20px 0;
  }
  .upload-list {
    margin-bottom: 20px;
  }
  .album-btn {
    display: block;
  }
}
</style>
