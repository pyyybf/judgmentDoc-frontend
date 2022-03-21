import {
  exportPdfAPI,
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
            reject('导出失败');
          }
        }).catch(error => {
          reject(error);
        })
      });
    },
  }
};
export default editor;
