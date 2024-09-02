import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Contact } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const fetchContacts = async ({ id }: { id: number }): Promise<{ data: Contact[]; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-contacts/count`)).data
    const res = await axiosInstance.get(`/api/pbf-organization-contacts`, {
      params: {
        size: count,
        'entityId.equals': id
      }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneContact = async (id: number): Promise<Contact | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-contacts/${id}`)

    const entity = (await axiosInstance.get(`/api/pbf-organization-entities/${res.data.id}`)).data
    const contract = (await axiosInstance.get(`/api/pbf-organization-contracts/${res.data.id}`)).data

    return { ...res.data, entity: entity, contract: contract }
  } catch (error) {
    console.error(error)

    return null
  }
}

function incrementDateByMonths(inputDate: Date | string, m: number) {
  const date = new Date(inputDate)
  date.setMonth(date.getMonth() + m)

  return date
}

export const createContact = async (data: Contact): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-organization-contacts`, {
      ...data
    })

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateEntityContact = async (id: number, data): Promise<{ success: boolean; id?: number }> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-organization-contacts/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateContact = async (id: number, data: Contact): Promise<{ success: boolean; id?: number }> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-organization-contacts/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const deleteContact = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-contacts/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

// /pbf-organization-contracts/promotion/{id}
export const fetchPromotionContract = async (id: number): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-contracts/promotion/${id}`)

    return res.data
  } catch (error) {
    throw error
  }
}

export const fetchDemotionContract = async (id: number): Promise<any> => {
  try {
    // return a
    const res = await axiosInstance.get(`/api/pbf-organization-contracts/demotion/${id}`)

    return res.data
  } catch (error) {
    throw error
  }
}
