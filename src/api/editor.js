import HttpRequest from '@/axios/api.request'

const api = {
  editorPre: '/api/editor',
}

export const exportPdfAPI = (data) => {
  let body = new URLSearchParams();
  for (var key in data) {
    body.append(key, data[key]);
  }
  return HttpRequest.request({
    url: `${api.editorPre}/exportPdf`,
    method: 'POST',
    responseType: 'blob',
    data
  })
}
