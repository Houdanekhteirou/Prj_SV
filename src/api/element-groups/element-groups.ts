import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { ElementGroups } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'
import { saveDocs } from '../other'

export const fetchElementGroups = async ({
  pageNumber = 0,
  pageSize = 20,
  all = false,
  name = ''
}: {
  pageSize: number
  pageNumber: number
  all?: boolean
  name?: string
}): Promise<{ data: ElementGroups[]; count: number } | null> => {
  let resCount

  if (resCount) {
    resCount = (
      await axiosInstance.get(`/api/pbf-data-element-groups/count`, {
        params: {
          ...(name && { 'title.contains': name })
        }
      })
    ).data
  }
  try {
    const res = await axiosInstance.get(`/api/pbf-data-element-groups`, {
      params: {
        page: pageNumber,
        size: all ? resCount : pageSize,
        ...(name && { 'title.contains': name }),
        sort: 'id,desc'
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-data-element-groups/count`)).data

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneElementGroups = async (id: number): Promise<ElementGroups | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-element-groups/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createElementGroups = async (data: ElementGroups): Promise<{ success: boolean; id?: number }> => {
  try {
    let res
    const saveRes = await saveDocs(data.iconFile, 'img')
    if (saveRes.success) {
      data.iconFile = saveRes.path
      res = await axiosInstance.post(`/api/pbf-data-element-groups`, data)
    } else {
      return { success: false, message: 'Image Existe Deja' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}

export const updateElementGroups = async (
  id: number,
  data: ElementGroups
): Promise<{ success: boolean; id?: number }> => {
  data.id = id
  let res
  try {
    const saveRes = await saveDocs(data.iconFile, 'img')
    if (saveRes.success) {
      data.iconFile = saveRes.path
      res = await axiosInstance.put(`/api/pbf-data-element-groups/${id}`, data)
    } else {
      return { success: false, message: 'Image Existe Deja' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}
export const deleteElementGroups = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-element-groups/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
