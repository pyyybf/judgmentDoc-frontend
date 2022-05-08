import HttpRequest from '@/axios/api.request'

const api = {
  articlePre: '/api/article',
}

export const getAllAPI = (data) => {
  let params = new URLSearchParams();
  for (var key in data) {
    params.append(key, data[key]);
  }
  return HttpRequest.request({
    url: `${api.articlePre}/getAll`,
    method: 'GET',
    params
  })
}

export const getArticleCatalogTreeAPI = () => {
  return HttpRequest.request({
    url: `${api.articlePre}/getCatalogue`,
    method: 'GET',
  })
}
