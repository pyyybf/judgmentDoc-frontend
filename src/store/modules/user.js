import {
  loginAPI,
  registerAPI,
  getUserInfoByIdAPI,
  updateAvatarByIdAPI,
  updateUserInfoByIdAPI,
  updatePasswordByIdAPI,
} from "@/api/user";

const user = {
  state: {
    username: '',
    userId: -1,
    role: -1,
    avatar: '',
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
    set_avatar: (state, data) => {
      state.avatar = data;
      localStorage.setItem('avatar', state.avatar);
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
            commit('set_avatar', response.data.content.avatar);
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
        commit('set_avatar', '')
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('avatar');
        resolve();
      });
    },
    register({}, data) {
      return new Promise((resolve, reject) => {
        registerAPI(data).then(response => {
          if (response.data.success) {
            resolve(response.data.content);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    getUserInfoById({commit}, data) {
      return new Promise((resolve, reject) => {
        getUserInfoByIdAPI(data).then(response => {
          if (response.data.success) {
            commit('set_username', response.data.content.username);
            commit('set_userId', response.data.content.id);
            commit('set_role', response.data.content.role);
            commit('set_avatar', response.data.content.avatar);
            resolve(response.data.content);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    updateAvatarById({}, data) {
      return new Promise((resolve, reject) => {
        updateAvatarByIdAPI(data).then(response => {
          if (response.data.success) {
            resolve(response.data.content);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    updateUserInfoById({}, data) {
      return new Promise((resolve, reject) => {
        updateUserInfoByIdAPI(data).then(response => {
          if (response.data.success) {
            resolve(response.data.content);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    updatePasswordById({}, data) {
      return new Promise((resolve, reject) => {
        updatePasswordByIdAPI(data).then(response => {
          if (response.data.success) {
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
