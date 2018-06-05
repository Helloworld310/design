<template>
  <div class="index" :class="{'detail-bg': display === 'detail'}">
    <div class="carousel" v-if="display === 'list'">
      <el-carousel trigger="click" height="215px">
        <el-carousel-item v-for="item in items" :key="item">
          <img :src="item" alt="轮播图">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="content" v-if="display === 'list'">
      <div class="left">
        <div class="article-search">
          <el-input placeholder="请输入日志标题" v-model="articleSeacrh">
            <el-button slot="append" icon="el-icon-search" @click="searchArticle"></el-button>
          </el-input>
        </div>
        <div class="article-header">最新日志</div>
        <div class="article-tip" v-show="articles.length === 0">暂无数据</div>
        <div class="articles" v-for="(item, key) in articles" :key="'key' + key">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="about-me">
          <h3>关于我</h3>
          <div class="about-content">
            <div class="about-tip" v-for="(item, i) in aboutInfo" :key="'aboutInfo' + i">
              <span class="key">{{ item.key }}</span>
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="albums">
          <h3>相册</h3>
          <div class="albums-content">
              <div class="album-list" v-for="(item, i) in albumList" :key="'albums' + i">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="item.avatar" class="image">
                  <div style="padding: 14px;">
                    <span>{{item.title}}</span>
                    <div class="bottom clearfix">
                      <time class="time">{{ item.time }}</time>
                      <el-button type="text" class="button" @click="checkAlbum(i)">查看</el-button>
                    </div>
                  </div>
                </el-card>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="article-detail" v-if="display === 'detail'">
      <h3>{{ articleTitle }}</h3>
      <div v-html="articleContent"></div>
      <div class="btn">
        <el-button @click="back" type="primary">返回</el-button>
      </div>
    </div>
    <div v-if="display === 'detailAlbum'">
      <div class="detail-btn">
        <el-button type="primary" @click="back">返回</el-button>
      </div>
      <div class="album-detail">
        <div class="album" v-for="(item, j) in pictures" :key="'pictureList' + j">
          <div class="album-list" >
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.url" class="image">
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import time from '../assets/svg/time.svg'
import user from '../assets/svg/user.svg'
export default {
  data () {
    return {
      items: [
        'https://luojc.cn/designImg/upload_e286a5ccd66af205ac28df89de2dcdf2.jpg',
        'https://luojc.cn/designImg/upload_93ffce61050cd7d7de354bfea9cf4359.jpg',
        'https://luojc.cn/designImg/upload_94293349f5f355cc803802967188f900.jpg'
      ],
      aboutInfo: [
        {key: '姓名:', name: '罗金城'},
        {key: '地区:', name: '广东深圳'},
        {key: '职业:', name: '前端工程师'},
        {key: '简介:', name: '大四应届毕业生'}
      ],
      articles: [],
      display: 'list',
      userImg: user,
      timeImg: time,
      articleSeacrh: '',
      articleTitle: '',
      articleContent: '',
      albumList: [],
      pictures: []
    }
  },
  methods: {
    getList () {
      let url = this.$api + '/article/hasPush'
      axios.post(url, {isNew: true})
        .then(res => {
          this.articles.splice(0, this.articles.length)
          if (res.data.code === 0 && res.data.data.length !== 0) {
            this.articles = res.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    check (i) {
      this.display = 'detail'
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
    back () {
      this.getList()
      this.display = 'list'
    },
    searchArticle () {
      if (this.articleSeacrh === '') {
        this.$msg({
          message: '搜索内容不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      axios.post(this.$api + '/article/search', {search: this.articleSeacrh})
        .then(res => {
          if (res.data.code === 0) {
            this.articles.splice(0, this.articles.length)
            this.articles = res.data.data
            this.$msg({
              message: '搜索成功',
              type: 'success',
              center: true
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAlbum () {
      axios.post(this.$api + '/album/pictures', {isNew: true})
        .then(res => {
          if (res.data.code === 0) {
            this.albumList = res.data.data.albums
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkAlbum (i) {
      axios.post(this.$api + '/album/detail', {id: this.albumList[i].id})
        .then(res => {
          if (res.data.code === 0) {
            this.pictures.splice(0, this.pictures.length)
            this.display = 'detailAlbum'
            if (!res.data.data.pictures.length) return
            this.pictures = JSON.parse(res.data.data.pictures)
            console.log('pictures', this.pictures)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getList()
    this.getAlbum()
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/overview') {
        this.getList()
        this.getAlbum()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.detail-bg {
  background: #fff;
  .article-detail {
    padding: 10px 20px 20px;
  }
}
.index {
  width: 100%;
  .carousel {
    img {
      width: 100%;
      height: 215px;
    }
  }
  .content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .left {
      width: 65%;
      .article-header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        margin-top: 15px;
        background-color: #F7F7F7;
        padding-left: 10px;
        box-sizing: border-box;
      }
      .article-tip {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 10px;
        box-sizing: border-box;
        background-color: #fff;
      }
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
      }
    }
    .right {
      width: 32%;
      height: 600px;
      .about-me {
        h3 {
          text-align: left;
          margin: 0;
          background: #F6F6F6;
          font-weight: normal;
          padding-left: 20px;
          line-height: 38px;
        }
        .about-content {
          height: 200px;
          background: #fff;
          padding-top: 20px;
          .about-tip {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            margin: 20px 30px;
            .key {
              font-weight: bold;
              margin-right: 30px;
            }
          }
        }
      }
      .albums {
        margin-top: 10px;
        h3 {
          text-align: left;
          margin: 0;
          background: #F6F6F6;
          font-weight: normal;
          padding-left: 20px;
          line-height: 38px;
        }
        .albums-content {
          height: 850px;
          background: #fff;
          padding: 20px 10px 10px;
        }
      }
    }
  }
}
.albums-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.album-list {
  display: flex;
  text-align: left;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 8px;
  line-height: 12px;
  margin-bottom: 5px;
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
    clear: both
}
.album-detail {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  .album {
    margin-right: 20px;
    margin-top: 20px;
  }
}
.detail-btn {
  padding: 15px 0 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
<style>
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
