import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Frequency } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchFrequencies = async (): Promise<Frequency[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-frequencies`)

    return res.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const fetchOneFrequency = async (id: number): Promise<Frequency | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-frequencies/${id}`)

    return res.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const fetchFrequencieHistory = async (id: number): Promise<Frequency[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-files-log/${id}`)

    return res.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const createFrequency = async (data: Frequency): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-data-frequencies`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export const updateFrequency = async (id: number, data: Frequency): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-data-frequencies/${id}`, data)

    const status200 = String(res.status).startsWith('2')
    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}
export const deleteFrequency = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-frequencies/${id}`)

    const status200 = String(res.status).startsWith('2')
    return status200
  } catch (error) {
    console.error(getErrorMessage(error))
    return false
  }
}
