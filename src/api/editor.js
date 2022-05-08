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
    url: `${api.editorPre}/export/pdf`,
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export const exportWordAPI = (data) => {
  let body = new URLSearchParams();
  for (var key in data) {
    body.append(key, data[key]);
  }
  return HttpRequest.request({
    url: `${api.editorPre}/export/word`,
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export const checkAPI = (data) => {
  return HttpRequest.request({
    url: `${api.editorPre}/check`,
    method: 'GET',
    params: data
  })
}
