import {
  getAllAPI,
  getDocumentCatalogTreeAPI,
  getDocumentByIdAPI,
  getDocumentsByUserIdAPI,
} from "@/api/document";

const document = {
  state: {},
  mutations: {},
  actions: {
    getAllDocument({commit}, data) {
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
    getDocumentCatalogTree({commit}, data) {
      return new Promise((resolve, reject) => {
        getDocumentCatalogTreeAPI(data).then(response => {
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
    getDocumentById({commit}, data) {
      return new Promise((resolve, reject) => {
        getDocumentByIdAPI(data).then(response => {
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
    getDocumentsByUserId({commit}, data) {
      return new Promise((resolve, reject) => {
        getDocumentsByUserIdAPI(data.userId, {
          pageNum: data.pageNum,
          pageSize: data.pageSize
        }).then(response => {
          if (response.data.success) {
            resolve(response.data.content);
          } else {
            reject(response.data.message);
          }
        }).catch(error => {
          reject(error);
        })
      });
    }
  }
};
export default document;
