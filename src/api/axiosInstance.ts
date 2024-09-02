import axios from 'axios'

import authConfig from 'src/configs/auth'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(async config => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  const locale = window.localStorage.getItem('i18nextLng')!
  const token = storedToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.params = {
    ...config.params,
    locale: locale
  }

  return config
})

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem(authConfig.userStorangeKeyName)
      window.localStorage.removeItem(authConfig.storageTokenKeyName)

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
export default axiosInstance
