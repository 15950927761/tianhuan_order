import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` 不会在侧边栏中显示（默认为false）
* alwaysShow: true               if set true, 将始终显示根菜单，无论其子路由长度如何
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` 在面包屑中不会重定向
* name:'router-name'             路由名称必须设 <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     将控制页面角色（可以设置多个角色）
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,面将不被缓存（默认为false）
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  {
    path: '/private',
    component: Layout,
    redirect: '/private/list',
    name: 'Private',
    meta: {
      title: '出入作业',
      icon: 'clipboard',
      roles: ['admin']
    },
    children: [
      {
        path: 'inbound',
        component: () => import('@/views/inbound/list'),
        name: 'Inbound',
        meta: { title: '采购订单' },
        roles: ['admin']
      },
      {
        path: 'inbound_info',
        component: () => import('@/views/inbound/info'),
        name: 'Info',
        hidden: true,
        meta: { title: '订单详情' },
        roles: ['admin']
      },
      {
        path: 'outbound',
        component: () => import('@/views/outbound/list'),
        name: 'Outbound',
        meta: { title: '出库订单' },
        roles: ['editor']
      },
      {
        path: 'outbound_info',
        component: () => import('@/views/outbound/info'),
        name: 'Outbound_info',
        hidden: true,
        meta: { title: '订单详情', roles: ['editor'] }
      },
      {
        path: 'diaohuo',
        component: () => import('@/views/diaohuo/list'),
        name: 'Diaohuo',
        meta: { title: '调货作业' },
        roles: ['admin', 'private']
      },
      {
        path: 'diaohuo_info',
        component: () => import('@/views/diaohuo/info'),
        name: 'Diaohuo_info',
        hidden: true,
        meta: { title: '调货详情', roles: ['editor'] }
      },
      {
        path: 'store_outbound',
        component: () => import('@/views/storeOutbound/list'),
        name: 'Store_outbound',
        meta: { title: '自销出库' },
        roles: ['admin', 'private']
      },
      {
        path: 'store_outbound_info',
        component: () => import('@/views/storeOutbound/info'),
        name: 'Store_outbound_info',
        hidden: true,
        meta: { title: '出库详情', roles: ['editor'] }
      }
      // {
      //   path: 'quanxian',
      //   component: () => import('@/views/quanxian/list'),
      //   name: 'Quanxian',
      //   meta: { title: '权限控制' },
      //   roles: ['editor']
      // }
    ]
  },
  // {
  //   path: '/common',
  //   component: Layout,
  //   redirect: '/cinbound/list',
  //   name: 'Cinbound',
  //   meta: {
  //     title: '公库作业',
  //     icon: 'documentation'
  //   },
  //   children: [
  //     {
  //       path: 'cinbound',
  //       component: () => import('@/views/cinbound/list'),
  //       name: 'Cinbound',
  //       meta: { title: '入库作业' }
  //     },
  //     {
  //       path: 'cinbound_info',
  //       component: () => import('@/views/cinbound/info'),
  //       name: 'Cinbound_info',
  //       hidden: true,
  //       meta: { title: '入库详情' },
  //       roles: ['admin']
  //     },
  //     {
  //       path: 'coutbound',
  //       component: () => import('@/views/coutbound/list'),
  //       name: 'Coutbound',
  //       meta: { title: '出库作业' }
  //     },
  //     {
  //       path: 'coutbound_info',
  //       component: () => import('@/views/coutbound/info'),
  //       name: 'Coutbound_info',
  //       hidden: true,
  //       meta: { title: '出库详情', roles: ['editor'] }
  //     }
  //   ]
  // },
  {
    path: '/basics',
    component: Layout,
    redirect: '/basics/list',
    name: 'Basics',
    meta: {
      title: '基础信息',
      icon: 'excel'
    },
    children: [
      // {
      //   path: 'store',
      //   component: () => import('@/views/store/list'),
      //   name: 'Store',
      //   meta: { title: '商户管理' }
      // },
      // {
      //   path: 'unit',
      //   component: () => import('@/views/unit/list'),
      //   name: 'Unit',
      //   meta: { title: '单位信息' }
      // },
      // {
      //   path: 'item_type',
      //   component: () => import('@/views/itemtype/list'),
      //   name: 'Itemtype',
      //   meta: { title: '物料类型' }
      // },
      {
        path: 'item_info',
        component: () => import('@/views/item/list'),
        name: 'Iteminfo',
        meta: { title: '物料信息' }
      }
    ]
  },
  // {
  //   path: '/coolie',
  //   component: Layout,
  //   redirect: '/coolie/list',
  //   name: 'Coolie',
  //   meta: {
  //     title: '员工管理',
  //     icon: 'edit'
  //   },
  //   children: [
  //     {
  //       path: 'coolie',
  //       component: () => import('@/views/coolie/list'),
  //       name: 'Coolie',
  //       meta: { title: '员工信息' }
  //     },
  //     {
  //       path: 'post',
  //       component: () => import('@/views/post/list'),
  //       name: 'Post',
  //       meta: { title: '岗位信息' }
  //     },
  //     {
  //       path: 'storekeeper',
  //       component: () => import('@/views/storekeeper/list'),
  //       name: 'Storekeeper',
  //       meta: { title: '仓管信息' }
  //     }
  //   ]
  // },
  // {
  //   path: '/warehouse',
  //   component: Layout,
  //   redirect: '/warehouse/list',
  //   name: 'Warehouse',
  //   meta: {
  //     title: '仓库设置',
  //     icon: 'international'
  //   },
  //   children: [
  //     {
  //       path: 'warehouse',
  //       component: () => import('@/views/warehouse/list'),
  //       name: 'Warehouse',
  //       meta: { title: '仓库信息' }
  //     },
  //     {
  //       path: 'area',
  //       component: () => import('@/views/area/list'),
  //       name: 'Area',
  //       meta: { title: '库区编号' }
  //     }
  //   ]
  // },
  {
    path: '/stock',
    component: Layout,
    redirect: '/total/stock_list',
    name: 'Stock',
    meta: {
      title: '库存报表',
      icon: 'tab'
    },
    children: [
      {
        path: 'stock',
        component: () => import('@/views/total/stock_list'),
        name: 'Stock',
        meta: { title: '库存列表' }
      },
      {
        path: 'stock_count',
        component: () => import('@/views/total/stock_total'),
        name: 'Stock_count',
        meta: { title: '库存统计' }
      },
      {
        path: 'stock_detail',
        component: () => import('@/views/total/stock_detail'),
        name: 'Stock_detail',
        meta: { title: '库存明细' }
      }
    ]
  },
  {
    path: '/receipt',
    component: Layout,
    redirect: '/receipt/receipt_list',
    name: 'Receipt',
    meta: {
      title: '财务报表',
      icon: 'tab'
    },
    children: [
      {
        path: 'customer_info',
        component: () => import('@/views/customer/list'),
        name: 'Customer',
        meta: { title: '客户信息' }
      },
      {
        path: 'receipt',
        component: () => import('@/views/receipt/receipt_list'),
        name: 'Receipt',
        meta: { title: '客户收款' }
      },
      {
        path: 'detail_list',
        component: () => import('@/views/receipt/detail_list'),
        name: 'Detail_list',
        meta: { title: '款项明细' }
      },
      {
        path: 'total_list',
        component: () => import('@/views/receipt/total_list'),
        name: 'Total_list',
        meta: { title: '款项统计' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
