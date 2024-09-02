import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { AnyObject } from '@/types'
import { File } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchFiles = async ({
  pageNumber = 0,
  pageSize = 15,
  fileType = null,
  entityClassId = null,
  entiyId = null,
  year = null,
  month = null,
  zoneId = null
}: {
  pageSize: number
  pageNumber: number
  fileType: number | null
  entityClassId?: number | null
  entiyId?: number | null
  year?: number | null
  month?: number | null
  zoneId?: number | null
}): Promise<{ data: any[]; count: number } | null> => {
  try {
    const options: any = fileType ? { 'filetypeId.equals': fileType } : {}
    if (entityClassId) {
      options['entityClassId'] = entityClassId
    }
    if (entiyId) {
      options['entityId.equals'] = 48
    }
    if (year) {
      options['year.equals'] = year
    }
    if (month) {
      options['month.equals'] = month
    }
    if (zoneId) {
      options['zoneId'] = zoneId
    }

    const res = await axiosInstance.get(`/api/pbf-data-files`, {
      params: {
        page: pageNumber,
        size: pageSize,
        'year.greaterThan': 2023,

        sort: 'id,desc',
        ...options
      }
    })

    const count = (
      await axiosInstance.get(`/api/pbf-data-files/count`, {
        params: {
          ...options,
          'year.greaterThan': 2023
        }
      })
    ).data

    return {
      data: res.data.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchFilesByEntityId = async (
  entityId: number,
  month?: number,
  year?: number,
  frequency?: 'Mensuelle' | 'quarterly'
): Promise<File[] | null> => {
  try {
    const optionalParams: AnyObject = {}
    if (month) {
      optionalParams['month.equals'] = month
    }
    if (year) {
      optionalParams['year.equals'] = year
    }

    if (frequency) {
      const theFrequency = (
        await axiosInstance.get(`/api/pbf-data-frequencies`, {
          params: {
            'name.equals': frequency
          }
        })
      ).data[0]
      optionalParams['frequencyId.equals'] = theFrequency.id
    }
    const res = await axiosInstance.get(`/api/pbf-data-files`, {
      params: {
        'entityId.equals': entityId,
        ...optionalParams
      }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// export const fetchFilesByEntitiesIds = async (
//   ids: number[]
// ): Promise<File[] | null> => {
//   try {
//     const res = await axiosInstance.get(`/api/pbf-data-files`, {
//       params: {
//         "entityId.in": ids.join(","),
//       },
//     });

//     return res.data.data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

export const fetchOneFile = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-files/${id}`)

    return res.data.object
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchFileElementsPerFile = async (fileId: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-file-elements-per-file`, {
      params: {
        fileId
      }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneFile2 = async (fileId: number): Promise<File | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-files`, {
      params: {
        'id.equals': fileId
      }
    })

    return res.data.data[0]
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createFile = async (data: Partial<File>): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-data-files`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: status200 ? res.data.id : null }
  } catch (error) {
    throw error
  }
}

export const updateFile = async (id: number, data: Partial<File>): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-data-files/${id}`, {
      ...data,
      id
    })

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: status200 ? res.data.id : null }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const updateFileElements = async (file_elements): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-data-file-elements/elements`, {
      file_elements: file_elements
    })

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: status200 ? res.data.id : null }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateFile_file_elements = async (
  id: number,
  data: Partial<File>
): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-data-file-elements/elements`, {
      ...data
    })

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: status200 ? res.data.id : null }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const deleteFile = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-files/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
