<template>
  <div class="user-login">
    <el-form ref="addFormRef" :model="formData" :rules="formRules" size="large" show-message>
      <div style="margin: 0 auto 10px; color: #fff; font-weight: bold; font-size: 24px; text-align: center;">OA 1.0</div>
      <el-form-item prop="username">
        <el-input v-model.trim="formData.username" prefix-icon="User" placeholder="账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model.trim="formData.password" show-password prefix-icon="Lock" placeholder="密码">
          <template #suffix>
            <el-button link icon="Refresh" @click.stop="formData.password = Math.random().toString(36).slice(-10)"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input v-model.trim="formData.captcha" maxlength="4" prefix-icon="Message" placeholder="验证码">
          <template #suffix>
            <el-icon v-if="loading" class="is-loading">
              <Loading />
            </el-icon>
            <img v-else class="captcha-img" :src="captchaImgSrc" @click="getCaptcha">
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { captcha } from '@/apis'
import { userLogin } from '@/apis/user'
export default {
  name: 'UserLogin',
  data() {
    return {
      loading: false,
      captchaImgSrc: '',
      formData: {
        username: '',
        password: '',
        captcha: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'none' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'none' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'none' }
        ]
      }
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    getCaptcha() {
      this.loading = true
      captcha().then(res => {
        if (res.size) this.captchaImgSrc = URL.createObjectURL(res)
      }).finally(() => {
        this.loading = false
      })
    },
    handleLogin() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          userLogin(this.formData).then(({ code, data }) => {
            if (code === '000000') {
              localStorage.setItem('Authorization', data)
              // const Location = new URL(location.href)
              // const redirect = Location.searchParams.get('redirect')
              // if (redirect) {
              //   location.href = redirect
              // } else {
                this.$router.replace('/')
              // }
            } else {
              this.getCaptcha()
            }
          }).catch(err => {
            console.error(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(../assets/bg.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  .el-form {
    padding: 20px;
    width: 340px;
    overflow: hidden;
    border-radius: var(--el-border-radius-base);
    background-color: rgba(200, 200, 200, 0.9);
  }
  .captcha-img {
    height: 30px;
    cursor: pointer;
  }
}
</style>