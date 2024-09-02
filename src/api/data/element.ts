import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Element } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'
import { saveDocs } from '../other'
import { RealTime } from 'src/configs/dummy'

export const fetchElements = async ({
  pageNumber = 0,
  pageSize = 20,
  all = false,
  fileType,
  name,
  locale,
  realTime,
  units
}: {
  pageSize?: number
  pageNumber?: number
  all?: boolean
  fileType?: number
  name?: string
  locale?: string
  realTime?: 0 | 1
  units?: number
}): Promise<{ data: Element[]; count: number } | null> => {
  let resCount
  const options = fileType ? { filetypeId: fileType } : ({} as any)
  if (name) {
    options['title.contains'] = name
  }

  if (all) {
    resCount = (await axiosInstance.get(`/api/pbf-data-elements/count`)).data
  }

  let params
  if (!all) {
    params = {
      page: pageNumber,
      size: pageSize,
      sort: 'id,desc',
      locale: locale,

      ...options
    }
  } else {
    params = {
      size: resCount,
      locale: locale
    }
    if (realTime) {
      params['realtimeResult.equals'] = 1
      params['units.equals'] = 19
    }
    if (units) {
      params['units.equals'] = units
    }
  }

  try {
    const res = await axiosInstance.get(`/api/pbf-data-elements`, {
      params
    })

    const count = (await axiosInstance.get(`/api/pbf-data-elements/count`)).data

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneElement = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-elements/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createElement = async (data: Element): Promise<{ success: boolean; id?: number }> => {
  try {
    let res
    const saveRes = await saveDocs(data.iconFile, 'img')
    if (saveRes.success) {
      data.iconFile = saveRes.path
      res = await axiosInstance.post(`/api/pbf-data-elements`, data)
    } else {
      return { success: false, message: 'Image Existe Deja' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}

export const updateElement = async (id: number, data: Element): Promise<{ success: boolean; id?: number }> => {
  data.id = id
  try {
    let res
    const saveRes = await saveDocs(data.iconFile, 'img')
    if (saveRes.success) {
      data.iconFile = saveRes.path
      res = await axiosInstance.patch(`/api/pbf-data-elements/${data.id}`, data)
    } else {
      return { success: false, message: 'Image Existe Deja' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}
export const deleteElement = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-elements/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

export const fetchAllFileTypeFrequency = async (id, isFileType): Promise<any[] | null> => {
  // frequencyId.equals=id
  try {
    let res
    if (!isFileType) res = await axiosInstance.get(`/api/pbf-data-filetype-frequencies?frequencyId.equals=${id}`)
    else
      res = await axiosInstance.get(`/api/pbf-data-filetype-frequencies/valid-elements-per-filetype/?filetypeId=${id}`)

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const addFileTypeToElement = async (data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-data-filetype-frequencies`, data)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

export const fetchOneFileTypeFrequencie = async (id): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-filetype-frequencies/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const deleteFileTypeFromElement = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-filetype-frequencies/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

export const updateFileTypeFrequencie = async (id: number, data: any): Promise<boolean> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-data-filetype-frequencies/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
