import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/overview',
      name: 'overview',
      component: resolve => require(['../components/OverView'], resolve)
    },
    {
      path: '/album',
      name: 'album',
      component: resolve => require(['../components/Album'], resolve)
    },
    {
      path: '/info',
      name: 'info',
      component: resolve => require(['../components/Info'], resolve)
    },
    {
      path: '/article',
      name: 'article',
      component: resolve => require(['../components/Article'], resolve)
    },
    {
      path: '/manager',
      name: 'manager',
      component: resolve => require(['../components/Manager'], resolve)
    },
    {
      path: '/edit',
      name: 'edit',
      component: resolve => require(['../components/Edit'], resolve)
    },
    {
      path: '*',
      name: 'notfound',
      component: resolve => require(['../components/NotFound'], resolve)
    }
  ]
})
