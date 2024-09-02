import axios from 'axios'
import axiosInstance from 'src/api/axiosInstance'
import { fetchZonesByUser } from './organizations/zones'

export const authenticate = async ({
  username,
  password
}: {
  username: string
  password: string
}): Promise<{
  success: boolean
  msg?: string
  token?: string
  account?: any
  userZones?: any
}> => {
  try {
    //
    const res = await axios.post(`/api/authenticate`, {
      username,
      password
    })

    if (res.data.id_token) {
      const account = await axios.get(`/api/account`, {
        headers: { Authorization: `Bearer ${res.data.id_token}` }
      })

      const userZones = (
        await axios.get(`/api/pbf-organization-zones-by-user`, {
          headers: { Authorization: `Bearer ${res.data.id_token}` }
        })
      ).data

      return { success: true, token: res.data.id_token, account: account.data, userZones: userZones }
    } else {
      console.error('Authentication failed. No token received.')

      return { success: false }
    }
  } catch (error) {
    console.error('Error during authentication:', error)

    return { success: false, msg: 'server_error' }
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
