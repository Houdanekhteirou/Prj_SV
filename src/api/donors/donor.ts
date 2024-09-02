import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Donor } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchDonors = async ({
  pageNumber = 0,
  pageSize = 20,
  all = false
}: {
  pageSize: number
  pageNumber: number
  all?: boolean
}): Promise<{ data: Donor[]; count: number } | null> => {
  let resCount

  if (resCount) {
    resCount = (await axiosInstance.get(`/api/pbf-finance-donors/count`)).data
  }
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-donors`, {
      params: {
        page: pageNumber,
        size: all ? resCount : pageSize
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-finance-donors/count`)).data

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneDonor = async (id: number): Promise<Donor | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-donors/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createDonor = async (data: Element): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-finance-donors`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateDonor = async (id: number, data: Element): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-finance-donors/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deleteDonor = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-finance-donors/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
