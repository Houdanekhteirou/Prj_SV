import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { EntityClasse } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchEntityClasses = async ({
  name = ''
}: {
  name?: string
}): Promise<{
  data: EntityClasse[]
  count: number
} | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entityclasses`, {
      params: {
        'name.contains': name
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-organization-entityclasses/count`)).data

    return { data: res.data.data, count }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneEntityClasse = async (id: number): Promise<EntityClasse | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entityclasses/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createEntityClasse = async (data: EntityClasse): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-organization-entityclasses`, data)

    const status200 = String(res.status).startsWith('2')

    return status200 && !!res.data.id
  } catch (error) {
    console.error(error)

    return false
  }
}

export const updateEntityClasse = async (id: number, data: EntityClasse): Promise<boolean> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-organization-entityclasses/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200 && !!res.data.id
  } catch (error) {
    console.error(error)

    return false
  }
}
export const deleteEntityClasse = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-entityclasses/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
