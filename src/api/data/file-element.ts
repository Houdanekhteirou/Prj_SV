import element from '@/app/[locale]/dashboard/data/elements/[...slug]/page'

import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { FileElement } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchFileElements = async ({
  pageNumber = 0,
  pageSize = 20
}: {
  pageSize: number
  pageNumber: number
}): Promise<{ data: FileElement[]; count: number } | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-file-elements`, {
      params: {
        page: pageNumber,
        size: pageSize
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-data-file-elements/count`)).data

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneFileElement = async (id: number): Promise<FileElement | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-data-file-elements/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createFileElement = async (
  data: Partial<FileElement>,
  dhis?: {
    entityId: string
    fileTypeId: string
    period: string
    element: string
    value: string
  }
): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-data-file-elements`, {
      ...data,
      amount: data.price * data.validatedValue,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      createdbyId: null,
      updatedbyId: null,
      deletedbyId: null,
      element: null
    })

    // const dhisRes = await axiosInstance.post(
    //   "http://sante.gov.mr:8080/dhis/api/dataValueSets",
    //   {
    //     dataSet: dhis.fileTypeId,
    //     period: dhis.period,
    //     orgUnit: dhis.entityId,
    //     dataValues: [{ dataElement: dhis.element, value: dhis.value }],
    //   },
    //   {
    //     headers: {
    //       Authorization: "Basic YWRtaW46dVkzZFdxXzVaZUdoOEwj",
    //       Cookie: "JSESSIONID=CAB6E993B5248CD1262FD0D037116F7D",
    //     },
    //   }
    // );

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const syncToDHIS = async (data): Promise<{ success: boolean; id?: number }> => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://sante.gov.mr:8080/dhis/api/dataValueSets',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic YWRtaW46dVkzZFdxXzVaZUdoOEwj'
      },
      data: data
    }

    const res = await axios(config)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const getDHIS = async (): Promise<{ success: boolean; id?: number }> => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://mauritanie.dhis2.org/dev/api/dataValueSets.json?dataSet=HHplti0AGyN&period=202305&orgUnit=ppjp2pXMcnQ',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic VGVzdF9HZXVzdDoxMjM0QFRlc3Q=',
      Cookie: 'JSESSIONID=62DD6C09ECA8C3E2CE345ADA5A5F6D7B'
    },
    data: ''
  }

  axios
    .request(config)
    .then(response => {
      return
    })
    .catch(error => {
      return
    })
}
export const updateFileElement = async (
  id: number,
  data: Partial<FileElement>
): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-data-file-elements/${id}`, {
      ...data,
      id
    })

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deleteFileElement = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-file-elements/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
