import axios from "axios"

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8001' : 'http://172.29.7.224:8001'

const HttpRequest = axios.create({
  baseURL: baseUrl,  // api的base_url
  timeout: 120000,  // 请求超时时间
  withCredentials: true
});

export default HttpRequest;
