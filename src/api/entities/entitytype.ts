import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { EntityType } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

import { number } from 'yup'
import { saveDocs } from '../other'

export const fetchEntityTypes = async ({
  pageNumber = 0,
  pageSize = 25,
  title = ''
}: {
  pageSize?: number
  pageNumber?: number
  name?: string
}): Promise<{
  data: EntityType[]
  count: number
} | null> => {
  try {
    const options: any = {}
    if (title) {
      options['title.contains'] = title
    }

    if (pageSize || pageNumber) {
      options.size = pageSize
      options.page = pageNumber
    }
    const res = await axiosInstance.get(`/api/pbf-organization-entitytypes`, {
      params: {
        ...options,
        sort: 'id,desc'
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-organization-entitytypes/count`)).data

    return { data: res.data.data, count }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneEntityType = async (id: number): Promise<EntityType | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entitytypes/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createEntityType = async (data: EntityType): Promise<boolean> => {
  try {
    let res
    const saveRes = await saveDocs(data.code, 'img')

    if (saveRes.success) {
      data.code = saveRes.path
      res = await axiosInstance.post(`/api/pbf-organization-entitytypes`, data)
    } else {
      return { success: false, message: 'Image Existe Deja' }
    }

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return false
  }
}

export const updateEntityType = async (id: number, data: EntityType): Promise<boolean> => {
  data.id = id
  try {
    let res
    const saveRes = await saveDocs(data.code, 'img')
    if (saveRes.success) {
      data.code = saveRes.path
      res = await axiosInstance.patch(`/api/pbf-organization-entitytypes/${data.id}`, data)
    } else {
      return { success: false, message: 'Image Existe Deja' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}
export const deleteEntityType = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-entitytypes/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
