import router from './router';
import {Message} from 'element-ui';

router.beforeEach(async (to, from, next) => {
  // determine whether the user has logged in
  const hasLogin = localStorage.getItem('userId');

  if (hasLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/articleList'});
    } else {
      next();
    }
  } else {
    if (to.path === '/login' || to.path === '/register') {
      next();
    } else {
      Message.error("未登录");
      next({path: '/login'});
    }
  }
})
