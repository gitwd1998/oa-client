import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/userLogin'), meta: { title: 'OA' } },
  { path: '/', name: 'layoutHeader', component: () => import('@/layout/layoutHeader'), children: [
    { path: '/', name: 'layoutAside', component: () => import('@/layout/layoutAside'), children: [
      { path: '/', name: 'layoutMain', component: () => import('@/layout/layoutMain'), children: [
        { path: '/', redirect: '/systemAdmin/userAdmin' },
        { path: '/systemAdmin', children: [
          { path: '/systemAdmin/userAdmin', name: 'UserAdmin', component: () => import('@/views/systemAdmin/UserAdmin'), meta: { title: '用户管理' } },
          { path: '/systemAdmin/roleAdmin', name: 'RoleAdmin', component: () => import('@/views/systemAdmin/RoleAdmin'), meta: { title: '角色管理' } },
          { path: '/systemAdmin/deptAdmin', name: 'DeptAdmin', component: () => import('@/views/systemAdmin/DeptAdmin'), meta: { title: '部门管理' } },
          { path: '/systemAdmin/menuAdmin', name: 'MenuAdmin', component: () => import('@/views/systemAdmin/MenuAdmin'), meta: { title: '菜单管理' } },
          { path: '/systemAdmin/dictAdmin', name: 'DictAdmin', component: () => import('@/views/systemAdmin/DictAdmin'), meta: { title: '字典管理' } },
          { path: '/systemAdmin/noticeAdmin', name: 'NoticeAdmin', component: () => import('@/views/systemAdmin/NoticeAdmin'), meta: { title: '公告管理' } },
        ] },
        {path: '/weixinAdmin', children: [
          { path: '/weixinAdmin/mediaAdmin', name: 'MediaAdmin', component: () => import('@/views/weixinAdmin/MediaAdmin'), meta: { title: '素材管理' } },
        ] }
      ] }
    ] }
  ] }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
})

export default router
