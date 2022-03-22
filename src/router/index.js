import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'
import Register from '@/views/register'

import Layout from '@/components/layout'
import ArticleList from '@/views/articleList'
import DocList from '@/views/docList'
import Editor from '@/views/editor'
import Predict from '@/views/predict'
import Home from '@/views/home'
import Info from '@/views/home/components/info'
import Documents from '@/views/home/components/documents'

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
        {
          path: '/home',
          name: 'home',
          component: Home,
          redirect: '/home/info',
          children: [
            {
              path: '/home/info',
              name: 'info',
              component: Info
            },
            {
              path: '/home/documents',
              name: 'documents',
              component: Documents
            },
          ]
        },
      ],
    }
  ]
})
