import {testAPI} from "@/api/user";

const user = {
  state: {},
  mutations: {},
  actions: {
    test({}) {
      return new Promise((resolve, reject) => {
        testAPI().then(response => {
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
