import HttpRequest from '@/axios/api.request'

const api = {
  userPre: '/api/user',
}

export const loginAPI = (data) => {
  return HttpRequest.request({
    url: `${api.userPre}/login`,
    method: 'GET',
    params: data
  })
}

export const registerAPI = (data) => {
  return HttpRequest.request({
    url: `${api.userPre}/register`,
    method: 'POST',
    data
  })
}
