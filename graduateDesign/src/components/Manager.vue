<template>
  <div class="index">
    <div class="content">
      <h3>登录</h3>
      <div class="login account">
        <label>账号：</label>
        <input type="text" v-model="account" placeholder="请输入账号" />
      </div>
      <div class="login password">
        <label>密码：</label>
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <div class="verification">
        <img :src="verificationPng" alt="验证码" @click="getVerification">
        <input type="text" v-model="verification" placeholder="请输入验证码" maxlength="4" @keyup.enter="login">
      </div>
      <button @click="login">登录</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      account: '',
      password: '',
      verificationPng: '',
      verificationKey: '',
      verification: ''
    }
  },
  methods: {
    ...mapActions([
      'changeLogin'
    ]),
    getVerificationStatus () {
    },
    login () {
      if (this.account.trim() === '') {
        this.$msg.error('用户名不能为空')
        return
      }
      if (this.password.trim() === '') {
        this.$msg.error('密码不能为空')
        return
      }
      if (this.verification === '') {
        this.$msg.error('验证码不能为空')
        return
      }
      let verificationParams = {
        verification: this.verification,
        verificationKey: this.verificationKey
      }
      axios.post(this.$api + '/verification/getVerificationStatus', verificationParams)
        .then(res => {
          if (res.data.code === 0) {
            let params = {
              account: this.account.trim(),
              password: this.password.toString().trim()
            }
            axios.post(this.$api + '/login/signin', params)
              .then(res => {
                if (res.data.code === 0) {
                  this.changeLogin({
                    isLogin: true
                  })
                  this.$msg({
                    message: '登录成功',
                    type: 'success',
                    center: true
                  })
                  this.$router.push('/')
                } else if (res.data.code === 1) {
                  this.$msg.error({
                    message: '账号或密码错误',
                    type: 'error',
                    center: true
                  })
                  this.getVerification()
                }
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            this.$msg.error('验证码错误')
            this.getVerification()
          }
        })
    },
    getVerification () {
      axios.get(this.$api + '/verification/getVerification')
        .then(res => {
          if (res.data.code === 0) {
            this.verificationPng = 'data:image/jpeg;base64,' + res.data.data.verificationPng
            this.verificationKey = res.data.data.verificationKey
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getVerification()
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/manager') {
        this.account = ''
        this.password = ''
        this.verification = ''
        this.getVerification()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.index {
  width: 100%;
  position: relative;
  height: 100%;
  background-color: #fff;
  .content {
    border: 1px solid #444;
    margin-top: 170px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 350px;
    padding-bottom: 20px;
    border-radius: 3px;
    h3 {
      background-color: #444;
      margin: 0;
      height: 40px;
      line-height: 40px;
      color: #fff;
      margin-bottom: 20px;
      letter-spacing: 10px;
    }
    .login {
      label {
        font-size: 18px;
        color: #555;
      }
      input {
        border-radius: 3px;
        outline: none;
        height: 30px;
        width: 200px;
        padding: 2px 10px;
        border: 1px #444 solid;
      }
    }
    .account {
      margin-bottom: 20px;
    }
    button {
      width: 280px;
      color: #fff;
      background-color: #444;
      border: none;
      cursor: pointer;
      border-radius: 3px;
      font-size: 18px;
      height: 35px;
      margin-top: 13px;
      letter-spacing: 10px;
    }
  }
  .verification {
    display: flex;
    flex-direction: row;
    padding: 15px 36px 0;
    justify-content: space-between;
  }
  .verification img {
    width: 120px;
    height: 30px;
  }
  .verification input {
    width: 100px;
    height: 20px;
    padding: 5px 0 5px 10px;
    border: 1px solid #444;
    letter-spacing: 2px;
    font-size: 14px;
  }
}
</style>
