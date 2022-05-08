import {
  getAllAPI,
  getArticleCatalogTreeAPI
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
    getArticleCatalogTree({commit}, data) {
      return new Promise((resolve, reject) => {
        getArticleCatalogTreeAPI(data).then(response => {
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
