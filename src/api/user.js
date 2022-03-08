import HttpRequest from '@/axios/api.request'

const api = {
  userPre: '/api/user',
}

export const testAPI = () => {
  return HttpRequest.request({
    url: `/api/test`,
    method: 'GET'
  })
}
