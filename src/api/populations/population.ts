import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { PopulationCible } from 'src/types/apis'

import axiosInstance from 'src/api/axiosInstance'

export const fetchPopulations = async ({
  pageNumber = 0,
  pageSize = 20,
  all = false,
  name = ''
}: {
  pageSize: number
  pageNumber: number
  all?: boolean
  name?: string
}): Promise<{ data: []; count: number } | null> => {
  let resCount
  const options = {}
  if (name) {
    options['name.contains'] = name
  }

  if (resCount) {
    resCount = (await axiosInstance.get(`/api/pbf-organization-target-populations/count`)).data
  }
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-target-populations`, {
      params: {
        page: pageNumber,
        size: all ? resCount : pageSize,
        sort: 'id,desc',
        ...options
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-organization-target-populations/count`)).data

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOnePopulation = async (id: number): Promise<PopulationCible | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-target-populations/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createPopulation = async (data: PopulationCible): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-organization-target-populations`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updatePopulation = async (
  id: number,
  data: PopulationCible
): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-organization-target-populations/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deletePopulation = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-target-populations/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
