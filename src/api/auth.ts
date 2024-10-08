import axios from 'axios'
import axiosInstance from 'src/api/axiosInstance'
import { fetchZonesByUser } from './organizations/zones'

import { RegisterParams } from 'src/context/types'



export const authenticate = async ({
  username,
  password
}: {
  username: string
  password: string
}): Promise<{
  success: boolean
  role?: string
  userId?: number
  email?: string
  token?: string
  msg?: string
}> => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URP}/authenticate`, { username, password })

    if (res.status === 200) {
      const { token, role, userId, email } = res.data
      if (token) {
        return { success: true, token, role, userId, email }
      } else {
        return { success: false, msg: 'no_token_received' }
      }
    } else {
      return { success: false, msg: 'authentication_failed' }
    }
  } catch (error) {
    return { success: false, msg: 'server_error' }
  }
}

//


export const register = async (params: RegisterParams) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URP}/sign-up`, params)
    console.log('process.env.NEXT_PUBLIC_API_URL',process.env.NEXT_PUBLIC_API_URL);

    // Assuming a 200 status code indicates success
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed'
    };
    // return { success: false, message: error.response?.data?.message || 'Registration failed' }
  }
}



export const getAccount = async (): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/api/account`)

    return res.data
  } catch (error) {
    console.error('Error during fetching account data:', error)

    return null
  }
}

export const updateAccount = async (data: any): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/api/account`, data)

    return res.data
  } catch (error) {
    console.error('Error during updating account data:', error)

    return null
  }
}
