import router from './router'
import store from './store'
// import { Message } from 'element-ui'
// import Layout from '@/views/layout/Layout'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken, setToken } from '@/utils/auth' // getToken from cookie
import { doBridgeRequest } from '@/api/bridge'

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (to.path === '/dashboard') {
    const token = to.query.token
    if (token) {
      doBridgeRequest(token).then((resp) => {
        resp = resp.data
        const code = resp.code
        if (code === 1) {
          const data = resp.data
          const oms_token = data.token
          if (oms_token) {
            localStorage.clear()

            setToken(oms_token)

            localStorage.setItem('loginStatus', '0')
            const roles = data.roles
            const user = data.data.user
            localStorage.setItem('roles', JSON.stringify(roles))
            localStorage.setItem('user', JSON.stringify(user))

            store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next(`/dashboard`)
              NProgress.done()
            })
            next()
          } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        } else {
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      })
    } else {
      if (getToken()) {
        const roles = JSON.parse(localStorage.getItem('roles'))
        store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const roles = JSON.parse(localStorage.getItem('roles'))
      store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      })
      next()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      const roles = JSON.parse(localStorage.getItem('roles'))
      store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      })
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
