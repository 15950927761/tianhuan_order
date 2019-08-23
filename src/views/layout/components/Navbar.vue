<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <!--<el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">-->
        <!--<size-select class="international right-menu-item"/>-->
        <!--</el-tooltip>-->

        <!--<lang-select class="international right-menu-item"/>-->

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.avatar" class="user-avatar">
          <span>{{ user.store_name }}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--<router-link to="/">-->
          <!--<el-dropdown-item>-->
          <!--{{ $t('navbar.dashboard') }}-->
          <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <a target="_blank" @click="alertEditPs()">
            <el-dropdown-item >
              {{ $t('navbar.editPassword') }}
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog :visible.sync="dialogFormVisible" title="修改密码" >
        <el-form :model="form">
          <el-form-item label-width="80px" label="原密码" >
            <el-input v-model="form.oldPassword" width="200px" auto-complete="off" type="password" />
          </el-form-item>
        </el-form>
        <el-form :model="form">
          <el-form-item label-width="80px" label="密码" >
            <el-input v-model="form.password" width="200px" auto-complete="off" type="password" />
          </el-form-item>
        </el-form>
        <el-form :model="form">
          <el-form-item label-width="80px" label="确认密码" >
            <el-input v-model="form.passwords" auto-complete="off" type="password" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePassword()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { setPassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      dialogFormVisible: false,
      user: JSON.parse(localStorage.getItem('user')),
      form: {
        oldPassword: '',
        password: '',
        passwords: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  created: function() {
    console.log(this.user)
  },
  methods: {
    initPsArr() {
      this.form = {
        oldPassword: '',
        password: '',
        passwords: ''
      }
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    alertEditPs() {
      this.dialogFormVisible = true
      this.initPsArr()
    },
    updatePassword() {
      if (!this.form.oldPassword || !this.form.password || !this.form.passwords) {
        this.$message('密码不能为空')
        return false
      } else {
        if (this.form.password !== this.form.passwords) {
          this.$message('两次输入密码不一致')
          return false
        }
        this.form.uid = this.user.uid
        setPassword(this.form).then(response => {
          const res = response.data
          if (res.code === 1) {
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            this.$message(res.message)
          }
        })
        this.dialogFormVisible = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
