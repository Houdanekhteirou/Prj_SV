import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { FileType } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

import { fetchOneFrequency } from './frequency'

export const fetchFileTypes = async ({
  pageNumber,
  pageSize,
  fileType = null,
  name = '',
  locale = 'fr',
  entityClassId = null,
  all = false
}: {
  pageSize?: number
  pageNumber?: number
  fileType?: number | null
  name?: string
  locale?: string
  entityClassId?: number | null
  all?: boolean
}): Promise<{ data: FileType[]; count: number } | null> => {
  try {
    const options: any = fileType ? { 'filetypeId.equals': fileType } : {}
    if (name) {
      options['name.contains'] = name
    }
    if (entityClassId) {
      options['entityClassId'] = entityClassId
    }

    if (pageSize || pageNumber) {
      options.size = pageSize
      options.page = pageNumber
    }
    if (locale) {
      options.locale = locale
    }

    options.sort = 'id,desc'

    const count = (await axiosInstance.get(`/api/pbf-data-filetypes/count`)).data

    if (all) {
      options.size = count
    }

    const res = await axiosInstance.get(`/api/pbf-data-filetypes`, {
      params: { ...options }
    })

    return {
      data: res.data.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}
export const fetchFileTypesByEntityType = async ({
  locale = 'fr',
  entityTypeId = null
}: {
  locale?: string
  entityTypeId?: number | null
}): Promise<{ data: FileType[] } | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-filetypes-by-entity-type`, {
      params: {
        locale,
        entityTypeId: entityTypeId
      }
    })

    return {
      data: res.data.data
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

// pbf-organization-target-populations
export const fetchTargetPopulations = async ({
  pageNumber,
  pageSize
}: {
  pageSize?: number
  pageNumber?: number
}): Promise<{ data: any; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-target-populations/count`)).data

    const res = await axiosInstance.get(`/api/pbf-organization-target-populations`, {
      params: {
        page: pageNumber || 0,
        size: pageSize || count

        // "name.contains": "fraud",
      }
    })

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneFileType = async (id: number): Promise<FileType | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-filetypes/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createFileType = async (data: FileType): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-data-filetypes`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateFileType = async (id: number, data: any): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-data-filetypes/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    throw error
  }
}
export const deleteFileType = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-filetypes/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
