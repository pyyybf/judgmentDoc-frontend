import {
  getAllAPI,
  getCatalogTreeAPI
} from "@/api/article";

const article = {
  state: {},
  mutations: {},
  actions: {
    getAllArticle({commit}, data) {
      return new Promise((resolve, reject) => {
        getAllAPI(data).then(response => {
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
    getCatalogTree({commit}, data) {
      return new Promise((resolve, reject) => {
        getCatalogTreeAPI(data).then(response => {
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
export default article;
