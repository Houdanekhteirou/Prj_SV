import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Account } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchAccounts2 = async ({
  pageNumber = 0,
  pageSize = null,
  number = null,
  all = false
}): Promise<{
  data: any
  count: number
} | null> => {
  try {
    const count = (
      await axiosInstance.get(`/api/pbf-finance-bank-accounts/count`, {
        params: {
          'number.contains': number
        }
      })
    ).data

    const res = await axiosInstance.get(`/api/pbf-finance-bank-accounts`, {
      params: {
        page: pageNumber,
        size: all ? count : pageSize,
        sort: 'id,desc',
        'number.contains': number
      }
    })

    return { data: res.data, count }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneAccounts = async (id: number): Promise<Account | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-bank-accounts/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createAccount = async (data: Account): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-finance-bank-accounts`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateAccounts = async (id: number, data: Account): Promise<{ success: boolean; id?: number }> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-finance-bank-accounts/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deleteAccounts = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-finance-bank-accounts/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
