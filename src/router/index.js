import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },

    {
      path: '/home',
      component: resolve => require(['../components/page/Home.vue'], resolve),
      meta: {title: '自述文件'},
      children: [
        {
          path: '/noteList',
          component: resolve => require(['../components/page/NoteList.vue'], resolve),
          meta: {title: 'markdown编辑器'},
          children: [
            {
              path: '/content',
              component: resolve => require(['../components/page/Content.vue'], resolve),
              meta: {title: 'w4e'},
            },
          ]
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },

  ]
})
