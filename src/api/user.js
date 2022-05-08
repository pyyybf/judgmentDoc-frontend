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

export const getUserInfoByIdAPI = (id) => {
  return HttpRequest.request({
    url: `${api.userPre}/getUserInfoById/${id}`,
    method: 'GET',
  })
}

export const updateAvatarByIdAPI = (data) => {
  return HttpRequest.request({
    url: `${api.userPre}/updateAvatarById`,
    method: 'PUT',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

export const updateUserInfoByIdAPI = (data) => {
  return HttpRequest.request({
    url: `${api.userPre}/updateUserInfoById/${data.id}`,
    method: 'PUT',
    data
  })
}

export const updatePasswordByIdAPI = (data) => {
  return HttpRequest.request({
    url: `${api.userPre}/updatePasswordById/${data.userId}`,
    method: 'PUT',
    params: {
      password: data.password,
      newPassword: data.newPassword
    }
  })
}
