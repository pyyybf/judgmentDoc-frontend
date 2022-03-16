import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'
import Register from '@/views/register'

import Layout from '@/components/layout'
import ArticleList from '@/views/articleList'
import DocList from '@/views/docList'
import Editor from '@/views/editor'
import Predict from '@/views/predict'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/login',
      children: [
        {
          path: '/articleList',
          name: 'ArticleList',
          component: ArticleList
        },
        {
          path: '/docList',
          name: 'docList',
          component: DocList
        },
        {
          path: '/editor',
          name: 'editor',
          component: Editor
        },
        {
          path: '/predict',
          name: 'predict',
          component: Predict
        },
      ],
    }
  ]
})
