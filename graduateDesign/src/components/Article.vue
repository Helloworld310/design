<template>
  <div class="index">
    <el-tabs v-model="activeName" @tab-click="handleClick" v-show="getLoginStatus">
      <el-tab-pane label="已发布" name="hasPush"></el-tab-pane>
      <el-tab-pane label="预发布" name="hasPrePush"></el-tab-pane>
      <el-tab-pane label="已下架" name="hasOffShelf"></el-tab-pane>
      <el-tab-pane label="回收站" name="hasDel"></el-tab-pane>
    </el-tabs>
    <div class="front-end">
      <div class="articles" v-for="(item, key) in articles" :key="'key' + key" v-if="display === 'list'">
        <div class="article-img" @click="check(key)"><img :src="item.img" alt=""></div>
        <div class="article-content">
          <div class="text">
            <p class="main-title" @click="check(key)">{{item.title}}</p>
            <p class="sub_title">简介：{{item.description}}</p>
            <div class="option">
              <div class="tip">
                <span><img :src="userImg" alt="用户">罗城</span>
                <span><img :src="timeImg" alt="时间">{{item.time}}</span>
                <span @click="check(key)">Read more >></span>
              </div>
              <div class="option-btn" v-show="getLoginStatus">
                <span @click="del(key)" v-show="item.status !== 'del'"><img :src="delImg" alt="删除">删除</span>
                <span @click="reEdit(key)" v-show="item.status !== 'del' && item.status !== 'offShelf'"><img :src="reEditImg" alt="重新编辑">重新编辑</span>
                <span @click="push(key)" v-show="item.status === 'hasPrePush'"><img :src="pushImg" alt="上线">上线</span>
                <span @click="offShelf(key)" v-show="item.status !== 'del' && item.status !== 'offShelf'"><img :src="offShelfImg" alt="下架">下架</span>
                <span @click="prePush(key)" v-show="item.status === 'offShelf'"><img :src="prePushImg" alt="预发布">预发布</span>
                <span @click="recovery(key)" v-show="item.status === 'del'"><img :src="recoveryImg" alt="恢复">恢复</span>
                <span @click="destroy(key)" v-show="item.status === 'del'"><img :src="destroyImg" alt="销毁">销毁</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination" v-show="display === 'list'">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="query.total"
          :page-size="query.pageSize"
          :current-page="query.currentPage"
          @current-change="changePage">
        </el-pagination>
      </div>
      <div class="article-detail" v-if="display === 'detail'">
        <h3>{{ articleTitle }}</h3>
        <div v-html="articleContent"></div>
        <div class="btn">
          <el-button @click="back" type="primary">返回</el-button>
          <el-button @click="reEdit()" v-show="getLoginStatus && (articles[index].status !== 'del' && articles[index].status !== 'offShelf')" type="primary">重新编辑</el-button>
        </div>
      </div>
    </div>
    <div v-show="display === 'reEdit'">
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
              class="avatar-uploader"
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
        <button @click="back2">返回</button>
        <button @click="saveAndPush" v-show="status === 'hasPrePush'">保存并预发布</button>
        <button @click="saveAndPush" v-show="status === 'hasPush'">保存并发布</button>
      </div>
    </div>
  </div>
</template>
<script>
import WangEditor from 'wangeditor'
import { mapGetters } from 'vuex'
import axios from 'axios'
import time from '../assets/svg/time.svg'
import user from '../assets/svg/user.svg'
import del from '../assets/svg/del.svg'
import reEdit from '../assets/svg/reEdit.svg'
import offShelf from '../assets/svg/offShelf.svg'
import recovery from '../assets/svg/recovery.svg'
import prePush from '../assets/svg/prePush.svg'
import push from '../assets/svg/push.svg'
import destroy from '../assets/svg/destroy.svg'
var editor = {}
export default {
  data () {
    return {
      articles: [],
      display: 'list',
      articleTitle: '',
      articleContent: '',
      title: '',
      description: '',
      status: '',
      id: 0,
      index: 0,
      isDetailClick: false,
      timeImg: time,
      userImg: user,
      delImg: del,
      reEditImg: reEdit,
      offShelfImg: offShelf,
      recoveryImg: recovery,
      prePushImg: prePush,
      destroyImg: destroy,
      pushImg: push,
      imageUrl: '',
      activeName: 'hasPush',
      query: {
        total: 0,
        currentPage: 0,
        pageSize: 5
      }
    }
  },
  computed: {
    ...mapGetters([
      'getLoginStatus'
    ])
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
  },
  methods: {
    handleClick (tab, event) {
      this.display = 'list'
      this.getList()
    },
    getUpload () {
      return this.$api + '/photo/saveImg'
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 0) {
        this.imageUrl = res.image_url
      }
    },
    beforeAvatarUpload (file) {
      console.log('file', file)
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$msg({
          message: '上传头像图片只能是 JPG 或 PNG 格式!',
          type: 'error',
          center: true
        })
      }
      if (!isLt2M) {
        this.$msg({
          message: '上传头像图片大小不能超过 1MB!',
          type: 'error',
          center: true
        })
      }
      return isJPG && isLt2M
    },
    getList () {
      let url = this.$api + '/article/' + this.activeName
      if (this.activeName === 'hasPush') {
        axios.post(url, {isNew: false, query: this.query})
          .then(res => {
            this.articles.splice(0, this.articles.length)
            if (res.data.code === 0 && res.data.data.length !== 0) {
              this.articles = res.data.data.articles
              this.query.total = res.data.data.total
            }
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        axios.post(url, {query: this.query})
          .then(res => {
            this.articles.splice(0, this.articles.length)
            if (res.data.code === 0 && res.data.data.length !== 0) {
              this.articles = res.data.data.articles
              this.query.total = res.data.data.total
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    check (i) {
      this.display = 'detail'
      this.index = i
      let url = this.$api + '/article/detail'
      axios.post(url, {id: this.articles[i].id})
        .then(res => {
          if (res.data.code === 0 && res.data.data.length !== 0) {
            this.articleTitle = res.data.data[0].title
            this.articleContent = res.data.data[0].content
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    del (i) {
      this.$confirm('此操作将删除该日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let url = this.$api + '/article/del'
        axios.post(url, {id: this.articles[i].id})
          .then(res => {
            if (res.data.code === 0) {
              this.$msg({
                message: '删除成功',
                type: 'success',
                center: true
              })
              this.getList()
            }
          })
          .catch(error => {
            console.log(error)
          })
      }).catch(() => {
        this.$msg({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    destroy (i) {
      this.$confirm('此操作将永久销毁该日志,销毁后不可恢复,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let url = this.$api + '/article/destroy'
        axios.post(url, {id: this.articles[i].id})
          .then(res => {
            if (res.data.code === 0) {
              this.$msg({
                message: '销毁成功',
                type: 'success',
                center: true
              })
              this.getList()
            }
          })
          .catch(error => {
            console.log(error)
          })
      }).catch(() => {
        this.$msg({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    back () {
      this.getList()
      this.display = 'list'
    },
    reEdit (i) {
      var index = 0
      if (this.display === 'list') {
        this.isDetailClick = false
        index = i
        this.index = i
      } else if (this.display === 'detail') {
        this.isDetailClick = true
        index = this.index
      }
      this.status = this.articles[this.index].status
      let url = this.$api + '/article/detail'
      axios.post(url, {id: this.articles[index].id})
        .then(res => {
          if (res.data.code === 0 && res.data.data.length !== 0) {
            let articles = res.data.data[0]
            this.id = articles.id
            this.title = articles.title
            this.description = articles.description
            this.imageUrl = articles.img
            editor.txt.html(articles.content)
            this.display = 'reEdit'
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    prePush (i) {
      this.$confirm('确定预发布该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios.post(this.$api + '/article/prePush', {id: this.articles[i].id})
            .then(res => {
              if (res.data.code === 0) {
                this.$msg({
                  message: '预发布成功',
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
    },
    push (i) {
      this.$confirm('确定将该日志上线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios.post(this.$api + '/article/push', {id: this.articles[i].id})
            .then(res => {
              if (res.data.code === 0) {
                this.$msg({
                  message: '上线成功',
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
    },
    offShelf (i) {
      this.$confirm('确定下架该日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios.post(this.$api + '/article/offShelf', {id: this.articles[i].id})
            .then(res => {
              if (res.data.code === 0) {
                this.$msg({
                  message: '下架成功',
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
    },
    recovery (i) {
      this.$confirm('确定恢复该日志并预发布, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios.post(this.$api + '/article/recovery', {id: this.articles[i].id})
            .then(res => {
              if (res.data.code === 0) {
                this.$msg({
                  message: '恢复成功',
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
    },
    back2 () {
      if (this.isDetailClick) {
        this.check(this.index)
        this.display = 'detail'
      } else {
        this.getList()
        this.display = 'list'
      }
    },
    saveAndPush () {
      let url = this.$api + '/article/reEdit'
      let params = {
        id: this.id,
        title: this.title,
        img: this.imageUrl,
        description: this.description,
        status: this.status,
        content: editor.txt.html()
      }
      axios.post(url, params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '保存并发布成功',
              type: 'success',
              center: true
            })
            this.back()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    changePage (currentPage) {
      this.query.currentPage = currentPage
      this.getList()
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/article' && this.display === 'list') {
        this.query.currentPage = 1
        this.getList()
      }
    },
    'getLoginStatus' (newVal, oldVal) {
      if (newVal === false) {
        this.activeName = 'hasPush'
      }
    }
  },
  created () {
    this.query.currentPage = 1
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.index {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  height: 100%;
  background-color: #fff;
  .articles {
    background: #fff;
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1px;
    border-bottom: 2px solid #f0f0f0;
    &:last-child {
      border: none;
    }
    &:hover {
      background-color: #F9FEF7;
    }
    .article-img {
      margin-left: 10px;
      img {
        width: 170px;
        height: 170px;
        cursor: pointer;
      }
    }
    .article-content {
      height: 150px;
      width: 555px;
      margin: -18px 20px 0;
      .text {
        .main-title {
          margin: 5px 0;
          text-align: left;
          color: #555;
          font-size: 16px;
          font-weight: 700;
          line-height: 25px;
          cursor: pointer;
          &:hover {
            color: #81c53f;
          }
        }
        .sub_title {
          margin: 0 0 10px;
          text-align: left;
          color: #888;
          font-size: 14px;
          line-height: 24px;
        }
      }
    }
    .option {
      display: flex;
      flex-direction: column;
    }
    .tip {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-top: 35px;
      span {
        display: inline-block;
        font-size: 12px;
        position: relative;
        margin-left: 19px;
        color: #999;
        margin-right: 25px;
        img {
          width: 15px;
          position: absolute;
          top: -2px;
          left: -19px;
        }
        &:last-child {
          cursor: pointer;
          margin-left: 10px;
        }
      }
    }
    .option .option-btn {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-top: 10px;
      span {
        display: inline-block;
        font-size: 12px;
        position: relative;
        margin-left: 19px;
        color: #999;
        margin-right: 25px;
        cursor: pointer;
        img {
          width: 15px;
          position: absolute;
          top: -2px;
          left: -19px;
        }
      }
    }
    .article-detail {
      .btn {
        display: flex;
        justify-content: space-around;
      }
    }
  }
  .list-btn {
    display: flex;
    justify-content: space-around;
  }
  .title {
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
}
.index .btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 30px;
}
.index .btn button {
  width: 120px;
  height: 35px;
  background-color: #409EFF;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}
.index .article-list {
  margin-bottom: 20px;
  background-color: #fff;
  border-bottom: 1px dotted #555;
  h3 {
    text-align: center;
    margin: 5px 0 0 10px;
    font-size: 20px;
    color: #555;
  }
  p {
    text-align: left;
    margin: 5px 0 5px 10px;
    font-size: 14px;
    color: #555;
    line-height: 20px;
  }
}
.article-list {
  button {
    width: 100px;
    height: 30px;
    background: #fff;
    border: 2px solid #555;
    color: #555;
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 2px;
  }
}
#editor {
  margin-top: 30px;
}
.pagination {
  margin-top: -3px;
  text-align: right;
  padding-top: 10px;
  width: 100%;
  background-color: #fff;
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
