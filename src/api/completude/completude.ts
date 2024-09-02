import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import axiosInstance from 'src/api/axiosInstance'

export const fetchCompletudeEntity = async ({ wilayaaId }): Promise<{ data: any[] } | null> => {
  try {
    const res = await axiosInstance.get(`/api/completudeEntity`, {
      params: {
        wilayaaId
      }
    })

    return {
      data: res.data
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchCompletudeWilayaa = async (): Promise<{
  data: any[]
} | null> => {
  try {
    const res = await axiosInstance.get(`/api/complutdeWilayaa`)

    return {
      data: res.data
    }
  } catch (error) {
    console.error(error)

    return null
  }
}
