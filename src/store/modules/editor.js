import {
  exportPdfAPI,
  exportWordAPI,
  checkAPI,
} from "@/api/editor";

const editor = {
  state: {},
  mutations: {},
  actions: {
    exportPdf({commit}, data) {
      return new Promise((resolve, reject) => {
        exportPdfAPI(data).then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject('文件导出失败');
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    exportWord({commit}, data) {
      return new Promise((resolve, reject) => {
        exportWordAPI(data).then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject('文件导出失败');
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
    check({commit}, data) {
      return new Promise((resolve, reject) => {
        checkAPI(data).then(response => {
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
export default editor;
