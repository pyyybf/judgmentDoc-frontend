import HttpRequest from '@/axios/api.request'

const api = {
  documentPre: '/api/document',
}

export const getAllAPI = (data) => {
  let params = new URLSearchParams();
  for (var key in data) {
    params.append(key, data[key]);
  }
  return HttpRequest.request({
    url: `${api.documentPre}/getAll`,
    method: 'GET',
    params
  })
}

export const getDocumentCatalogTreeAPI = () => {
  return HttpRequest.request({
    url: `${api.documentPre}/getCatalogue`,
    method: 'GET',
  })
}

export const getDocumentByIdAPI = (id) => {
  return HttpRequest.request({
    url: `${api.documentPre}/get/${id}`,
    method: 'GET',
  })
}

export const getDocumentsByUserIdAPI = (userId, data) => {
  return HttpRequest.request({
    url: `${api.documentPre}/getDocumentsByUserId/${userId}`,
    method: 'GET',
    params: data
  })
}
