import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
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
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'indexIcon', affix: true }
  //     }
  //   ]
  // }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    // redirect: '/register/list',
    // redirect: 'noRedirect',
    redirect: '/register/list',
    // name: '实时监测',
    meta: {
      // title: '实时监测',
      icon: 'iconfont icon--zongjiandengji',
      roles: ['admin',
        'web-regist-problem',
        'admin-centre-register-problem',
        'two-depart-register-problem',
        'centre-register-problem',
        'depart-register-problem'],
    },
    children: [
      {
        path: 'register/list',
        component: () => import('@/views/register/list'),
        name: 'modelList',
        meta: {
          title: '问题登记',
          roles: ['admin',
            'web-regist-problem',
            'admin-centre-register-problem',
            'two-depart-register-problem',
            'centre-register-problem',
            'depart-register-problem'],
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/examine/list',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-shenpishenhe',
      roles: [
        'admin',
        'web-stay-check',
        'admin-centre-check',
        'two-depart-chenck',
        'centre-cancel-pass-stay-check',
        'depart-cancel-pass-stay-check',
        'centre-abandon-pass-stay-check',
        'depart-pass-stay-check',
        'centre-pass-stay-check',
        'depart-pass-stay-check',
      ]
    },
    children: [
      {
        path: 'examine/list',
        component: () => import('@/views/examine/list'),
        name: 'examineList',
        meta: {
          title: '待审核',
          roles: [
            'admin',
            'web-stay-check',
            'admin-centre-check',
            'two-depart-chenck',
            'centre-cancel-pass-stay-check',
            'depart-cancel-pass-stay-check',
            'centre-abandon-pass-stay-check',
            'depart-pass-stay-check',
            'centre-pass-stay-check',
            'depart-pass-stay-check',
          ]
        }
      },
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dispatch/list',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-yipaifagongdanshu',
      roles: [
        'admin',
        'web-stay-dispatch',
        'centre-stay-dispatch',
        'two-depart-stay-dispat',
        'centre-abandon-stay-dispatch',
        'depart-abandon-stay-dispatch',
        'depart-turn-stay-dispatch',
        'depart-supported-applications-stay-dispatch',
        'center-dispatch-stay-dispatch',
        'depart-dispatch-stay-dispatch',
        'centre-write-stay-dispatch',
        'depart-write-stay-dispatch',
      ]
    },
    children: [
      {
        path: 'dispatch/list',
        component: () => import('@/views/dispatch/list'),
        name: 'dispatchList',
        meta: {
          title: '待派遣',
          roles: [
            'admin',
            'web-stay-dispatch',
            'centre-stay-dispatch',
            'two-depart-stay-dispat',
            'centre-abandon-stay-dispatch',
            'depart-abandon-stay-dispatch',
            'depart-turn-stay-dispatch',
            'depart-supported-applications-stay-dispatch',
            'center-dispatch-stay-dispatch',
            'depart-dispatch-stay-dispatch',
            'centre-write-stay-dispatch',
            'depart-write-stay-dispatch',
          ]
        }
      },
    ]
  },
  // {
  //   path: '/assist',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   // name: '示范小区',
  //   meta: {
  //     // title: '示范小区',
  //     icon: 'iconfont icon-xingxing',
  //     roles: [
  //       'admin',
  //     ]
  //   },
  //   children: [
  //     {
  //       path: 'verify',
  //       component: () => import('@/views/assist/list'),
  //       name: 'verifyList',
  //       meta: {
  //         title: '待协办',
  //         roles: [
  //           'admin',
  //         ]
  //       }
  //     },
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/end/list',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-anjian',
      roles: [
        'admin',
        'web-stay-end',
        'centre-reject-stay-end-case',
        'depart-reject-stay-end-case',

        'centre-end-case',
        'depart-end-case',
      ]
    },
    children: [
      {
        path: 'end/list',
        component: () => import('@/views/end/list'),
        name: 'endList',
        meta: {
          title: '待结案',
          roles: [
            'admin',
            'web-stay-end',
            'centre-reject-stay-end-case',
            'depart-reject-stay-end-case',
            'centre-end-case',
            'depart-end-case',
          ]
        }
      },
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/disposal/list',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-yichuzhigaojing',
      roles: [
        'admin',
        'web-stay-deal_with',
        'depart-stay-disposition',
      ]
    },
    children: [
      {
        path: 'disposal/list',
        component: () => import('@/views/disposal/list'),
        name: 'verifyList',
        meta: {
          title: '待处置',
          roles: [
            'admin',
            'web-stay-deal_with',
            'depart-stay-disposition',
          ]
        }
      },
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/case/list',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-chaxun',
      roles: [
        'admin',
        'web-all-query'
      ]
    },
    children: [
      {
        path: 'case/list',
        component: () => import('@/views/case/list'),
        name: 'verifyList',
        meta: {
          title: '案件查询',
          roles: [
            'admin',
            'web-all-query'
          ]
        }
      },
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/assistApply/list',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-wodeshenqing',
      roles: [
        'admin',
        'web-stay-supported-applications',
        'centre-reject-stay-supported-applications',
        'centre-stay-supported-applications',
        'centre-stay-write-applications'
      ]
    },
    children: [
      {
        path: 'assistApply/list',
        component: () => import('@/views/assistApply/list'),
        name: 'verifyList',
        meta: {
          title: '待协办申请',
          roles: [
            'admin',
            'web-stay-supported-applications',
            'centre-reject-stay-supported-applications',
            'centre-stay-supported-applications',
            'centre-stay-write-applications'
          ]
        }
      },
    ]
  },
]

const createRouter = () =>
  new Router({
    // base:'direct',
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
