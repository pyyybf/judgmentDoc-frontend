import {
  loginAPI,
  registerAPI,
} from "@/api/user";

const user = {
  state: {
    username: '',
    userId: -1,
    role: -1,
  },
  mutations: {
    set_username: (state, data) => {
      state.username = data;
      localStorage.setItem('username', state.username);
    },
    set_userId: (state, data) => {
      state.userId = data;
      localStorage.setItem('userId', state.userId);
    },
    set_role: (state, data) => {
      state.role = data;
      localStorage.setItem('role', state.role);
    },
  },
  actions: {
    login({commit}, data) {
      return new Promise((resolve, reject) => {
        loginAPI(data).then(response => {
          if (response.data.success) {
            commit('set_username', response.data.content.username);
            commit('set_userId', response.data.content.userId);
            commit('set_role', response.data.content.role);
            resolve(response.data.content.username);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit('set_username', '')
        commit('set_userId', -1)
        commit('set_role', -1)
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        resolve();
      });
    },
    register({}, data) {
      return new Promise((resolve, reject) => {
        registerAPI(data).then(response => {
          if (response.data.success) {
            console.log(response.data.content)
            resolve(response.data.content);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
  }
};
export default user;
