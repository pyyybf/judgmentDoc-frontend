import {testAPI} from "@/api/user";
import {loginAPI} from "../../api/user";

const user = {
  state: {
    username: '',
  },
  mutations: {
    set_username: (state, data) => {
      state.username = data;
      localStorage.setItem('username', JSON.stringify(state.username));
    },
  },
  actions: {
    login({commit}, data) {
      return new Promise((resolve, reject) => {
        loginAPI(data).then(response => {
          if (response.data.success) {
            commit('set_username', response.data.content.username)
            resolve(response.data.content.username);
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
