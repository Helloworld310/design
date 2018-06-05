<template>
  <div class="side">
    <div class="logo">
      <span>LJC' Blog</span>
    </div>
    <div class="content">
      <router-link to="/overview" active-class="active-link">
        <img :src="overview" alt="主页"/><span>主页</span>
      </router-link>
      <router-link to="/article" active-class="active-link">
        <img :src="article" alt="日志"/><span>日志</span>
      </router-link>
      <router-link to="/edit" active-class="active-link" v-show="getLoginStatus">
        <img :src="edit" alt="编辑"/><span>编辑</span>
      </router-link>
      <router-link to="/album" active-class="active-link">
        <img :src="album" alt="相册"/><span>相册</span>
      </router-link>
      <router-link to="/info" active-class="active-link">
        <img :src="info" alt="留言"/><span>留言</span>
      </router-link>
      <router-link to="/manager" active-class="active-link" v-show="!getLoginStatus">
        <img :src="manager" alt="登录"/><span>登录</span>
      </router-link>
      <a @click="logOut" v-show="getLoginStatus">
        <img :src="loginOut" alt="退出"><span>退出</span>
      </a>
    </div>
    <div class="sticky">
      <div class="avatar">
        <img src="//img.luojc.cn/images/LittleBitch.jpg" alt="头像">
        <div class="dashboard-stats" v-show="getLoginStatus">
          <div v-for="(item, i) in stats" :key="i" class="dashboard-item">
            <span class="num">{{ item.num }}</span>
            <span class="title">{{ item.title }}</span>
          </div>
        </div>
        <div class="link">
          <a href="https://github.com/TingYuLC" target="_blank"><img :src="github" alt="github"><span>Github</span></a>
          <a href="https://luojc.cn/" target="_blank"><img :src="resume" alt="resume"><span>Resume</span></a>
        </div>
      </div>
      <div class="notice">
        <div class="notice-header">最新公告</div>
        <div class="notice-content" v-for="(item, i) in notices" :key="i"  @click="showDetail(i)">
          <span class="text">{{i + 1}}. {{item.title}}</span>
          <span class="time">{{item.time}}</span>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="query.total"
          :page-size="query.pageSize"
          :current-page="query.currentPage"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
    <!-- 公告详情 -->
    <div class="dialog">
      <el-dialog
        :title="'公告(' + noticeTime + ')'"
        :visible.sync="dialogVisible"
        :center="true">
        <el-row v-show="!getLoginStatus">
          <p class="title">{{noticeTitle}}</p>
        </el-row>
        <el-row v-show="!getLoginStatus">
          <p class="content">{{noticeContent}}</p>
        </el-row>
        <el-row class="edit-content" v-show="getLoginStatus">
          <el-col :span="4">
            <span>公告标题</span>
          </el-col>
          <el-col :span="18" :offset="2">
            <el-input v-model="noticeTitle" />
          </el-col>
        </el-row>
        <el-row v-show="getLoginStatus">
          <el-col :span="4">
            <span>公告内容</span>
          </el-col>
          <el-col :span="18" :offset="2">
            <el-input type="textarea" v-model="noticeContent" />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false" v-show="getLoginStatus">取 消</el-button>
          <el-button type="primary" @click="saveNotice" v-show="getLoginStatus">保 存</el-button>
          <el-button type="primary" @click="dialogVisible = false" v-show="!getLoginStatus">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import overview from '@/assets/svg/overview.svg'
import article from '@/assets/svg/article.svg'
import album from '@/assets/svg/photo.svg'
import info from '@/assets/svg/info.svg'
import manager from '@/assets/svg/manager.svg'
import github from '@/assets/svg/github.svg'
import resume from '@/assets/svg/resume.svg'
import edit from '@/assets/svg/edit.svg'
import loginOut from '@/assets/svg/loginOut.svg'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  data () {
    return {
      overview: overview,
      article: article,
      album: album,
      info: info,
      github: github,
      resume: resume,
      manager: manager,
      edit: edit,
      loginOut: loginOut,
      notices: [],
      noticeTitle: '',
      noticeContent: '',
      noticeTime: '',
      id: '',
      dialogVisible: false,
      stats: [
        {
          num: 0,
          title: '日志',
          key: 'articles'
        },
        {
          num: 0,
          title: '相册',
          key: 'albums'
        },
        {
          num: 0,
          title: '公告',
          key: 'notices'
        }
      ],
      query: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'getLoginStatus',
      'getUpdateStatus'
    ])
  },
  methods: {
    ...mapActions([
      'changeLogin',
      'changeUpdate'
    ]),
    showDetail (i) {
      this.noticeTitle = this.notices[i].title
      this.noticeContent = this.notices[i].content
      this.noticeTime = this.notices[i].time
      this.id = this.notices[i].id
      this.dialogVisible = true
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(() => {
        })
        .catch(error => {
          console.log(error)
        })
    },
    getNoticesList () {
      axios.post(this.$api + '/notice/hasPush', this.query)
        .then(res => {
          if (res.data.code === 0) {
            this.notices.splice(0, this.notices.length)
            this.notices = res.data.data.notices
            this.query.total = res.data.data.total
            this.changeUpdate({isUpdate: false})
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveNotice () {
      let params = {
        title: this.noticeTitle,
        content: this.noticeContent,
        id: this.id
      }
      axios.post(this.$api + '/notice/update', params)
        .then(res => {
          if (res.data.code === 0) {
            this.$msg({
              message: '保存成功',
              type: 'success',
              center: true
            })
            this.getNoticesList()
            this.dialogVisible = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    changePage (currentPage) {
      this.query.currentPage = currentPage
      this.getNoticesList()
    },
    getStats () {
      axios.get(this.$api + '/stats/totalNum')
        .then(res => {
          if (res.data.code === 0) {
            let total = res.data.data
            this.stats.map(v => {
              v.num = total[v.key]
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    logOut () {
      this.$confirm('确定退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.changeLogin({
            isLogin: false
          })
          this.$router.push('/')
          this.$msg({
            message: '退出成功',
            type: 'success',
            center: true
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getNoticesList()
    this.getStats()
  },
  watch: {
    'getUpdateStatus' (newVal) {
      if (newVal) {
        this.query.currentPage = 1
        this.getNoticesList()
        this.getStats()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.side {
  width: 250px;
  .logo {
    width: 100%;
    height: 100px;
    background: #000;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    box-sizing: border-box;
    padding-top: 35px;
  }
  .content {
    width: 100%;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 25px 0 15px 0;
    box-sizing: border-box;
    a {
      text-decoration: none;
      color: #777;
      display: inline-block;
      text-align: left;
      padding-left: 10px;
      font-size: 14px;
      line-height: 40px;
      height: 40px;
      padding-left: 25px;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
      }
    }
    .active-link {
      &:hover {
        background: #F9F9F9;
      }
      background: #F9F9F9;
    }
  }
  .sticky {
    position: sticky;
    top: 12px;
  }
  .avatar {
    width: 100%;
    height: 260px;
    margin-top: 15px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      margin-top: 20px;
      margin-bottom: 10px;
      width: 100px;
      height: 100px;
    }
    .link {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px dotted #777;
      line-height: 41px;
      img {
        margin: 0;
        margin-right: 12px;
      }
    }
    a {
      text-decoration: none;
      color: #777;
      display: flex;
      align-items: center;
      height: 30px;
      font-size: 14px;
      img {
        margin-top: 0;
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .dashboard-stats {
      display: flex;
      width: 100%;
      height: 47px;
      margin: 5px;
      flex-direction: row;
      justify-content: space-around;
      .dashboard-item {
        display: flex;
        flex-direction: column;
        border-right: 1px dotted #409EFF;
        padding-right: 40px;
        .num {
          color: #409EFF;
          font-size: 16px;
          margin-bottom: 3px;
        }
        .title {
          font-size: 14px;
          font-weight: bold;
        }
        &:last-child {
          padding-right: 0;
          border: none;
        }
      }
    }
  }
  .notice {
    margin-top: 20px;
    background: #fff;
    .notice-header {
      text-align: left;
      padding: 8px 0 8px 10px;
      background: #f7f7f7;
      margin-bottom: 5px;
    }
    .notice-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      // margin-bottom: 2px;
      border-bottom: 1px solid #f0f0f0;
      color: #555;
      &:hover {
        color: #81c53f;
        cursor: pointer;
      }
    }
    .text {
      display: inline-block;
      width: 60%;
      margin: 0;
      text-align: left;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-size: 13px;
      padding-left: 10px;
    }
    .time {
      font-size: 12px;
      padding-right: 10px;
    }
  }
  .pagination {
    margin-top: -3px;
    text-align: right;
    padding-top: 10px;
    width: 100%;
    background-color: #fff;
  }
  .dialog {
    overflow: hidden;
    text-align: left;
    .dialog-footer {
      float: right;
      margin: 0 10px 20px 0;
    }
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
    .content {
      margin: 10px;
      word-wrap: break-word;
      word-break: break-all;
      text-indent: 29px;
    }
    .time {
      text-align: center;
      font-size: 12px;
      margin-top: -15px;
    }
    .edit-content {
      margin-bottom: 20px;
    }
  }
}
</style>
<style>
.dialog .el-dialog {
  overflow: hidden;
}
</style>
