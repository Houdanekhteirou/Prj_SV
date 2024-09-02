import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Level } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchLevels = async ({
  pageNumber = 0,
  pageSize = 15,
  name = ''
}: {
  pageSize?: number
  pageNumber?: number
  name?: string
}): Promise<{
  data: Level[]
  count: number
} | null> => {
  try {
    const options: any = {}
    if (name) {
      options['name.contains'] = name
    }

    if (pageSize || pageNumber) {
      options.size = pageSize
      options.page = pageNumber
    }

    const res = await axiosInstance.get(`/api/pbf-organization-levels`, {
      params: options
    })

    const count = (
      await axiosInstance.get(`/api/pbf-organization-levels/count`, {
        params: {}
      })
    ).data

    return { data: res.data.data, count }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneLevelByItsLevel = async (level: number): Promise<{ data: Level[]; count: number } | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-levels`, {
      params: { 'level.equals': level }
    })

    return res.data.data[0]
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneLevel = async (id: number): Promise<Level | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-levels/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createLevel = async (data: Level): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-organization-levels/`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return !!res.data.id
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

export const updateLevel = async (id: number, data: Level): Promise<boolean> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-organization-levels/${id}`, data)
    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(error)

    return false
  }
}
export const deleteLevel = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-levels/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
