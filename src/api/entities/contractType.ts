import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { ContractType } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchContractTypes = async (): Promise<ContractType[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-contracttypes`, {
      params: {
        sort: 'id,desc'
      }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneContractTypeType = async (id: number): Promise<ContractType | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-contracttypes/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createContractType = async (data: ContractType): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-organization-contracttypes`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateContractType = async (
  id: number,
  data: ContractType
): Promise<{ success: boolean; id?: number }> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-organization-contracttypes/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deleteContractType = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-contracttypes/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
