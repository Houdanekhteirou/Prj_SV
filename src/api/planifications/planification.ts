import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Planification } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

const fetchPlanification = async ({
  pageNumber = 0,
  pageSize = 20,
  zoneId
}: {
  pageSize: number
  pageNumber: number
  all?: boolean
  title?: string
  zoneId?: string
}): Promise<{ data: Planification[]; count: number } | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-planifications`, {
      params: {
        page: pageNumber,
        size: pageSize,
        sort: 'id,desc',
        ...(zoneId && { zoneId })
      }
    })

    const count = (
      await axiosInstance.get('/api/pbf-planifications/count', {
        params: {
          ...(zoneId && { zoneId })
        }
      })
    ).data

    return {
      data: res.data.content,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

const fetchOnePlanification = async (id: number): Promise<Planification | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-planifications/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// /api/pbf-planifications/filter? zoneId=1
const fetchPlanifiableEntities = async (zoneId: number): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-planifications/filter`, {
      params: {
        zoneId
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

const createPlanification = async (data: Planification): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-planifications`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

const updatePlanification = async (id: number, data: Planification): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-planifications/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

const deletePlanification = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-planifications/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

export { fetchPlanification, fetchOnePlanification, createPlanification, updatePlanification, deletePlanification }
