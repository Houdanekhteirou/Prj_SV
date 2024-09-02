import { getErrorMessage } from 'src/@core/utils/getErrorMessage'
import { Bank } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'
import exp from 'constants'

function transformBanks(banks) {
  // Create an empty result array to store the transformed objects
  const result = []

  // Create a map to store the parent banks based on their IDs
  const parentBanksMap = new Map()

  // First pass: Build the parent banks map and populate the result array
  for (const bank of banks) {
    if (bank.parentId === null) {
      // This bank is a parent
      const parentBank = {
        name: bank.name,
        id: bank.id,
        children: []
      }
      parentBanksMap.set(bank.id, parentBank)
      result.push(parentBank)
    } else {
      // This bank is a child
      const childBank = {
        name: bank.name,
        id: bank.id
      }
      const parentBank = parentBanksMap.get(bank.parentId)
      if (parentBank) {
        parentBank.children.push(childBank)
      }
    }
  }

  return result
}

export const fetchBanks = async ({
  pageNumber = 0,
  pageSize = 20,
  all = false,
  list = false
}: {
  pageSize?: number
  pageNumber?: number
  all?: boolean
  list?: boolean
}): Promise<{ data: any[]; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-finance-banks/count`)).data

    const res = await axiosInstance.get(`/api/pbf-finance-banks`, {
      params: { page: pageNumber, size: all ? count : pageSize , 'parentId.specified':true}
    })

    return { data: list ? transformBanks(res.data) : res.data, count: res.data.length }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchBanksByParentIdnull = async (parentId: number): Promise<Bank[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-banks`, {
      params: { 'parentId.equals': parentId }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneBank = async (id: number): Promise<Bank | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-banks/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchEntityAccounts = async ({ entityId }): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-bank-accounts/?entityId.equals=${entityId}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createEntityAccount = async (data): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-finance-bank-accounts`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const deleteEntityAccount = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-finance-bank-accounts/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

// update bank account
export const updateEntityAccount = async (id: number, data): Promise<{ success: boolean; id?: number }> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-finance-bank-accounts/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const createBank = async (data: Element): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-finance-banks`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const fetchBanksByParentId = async (): Promise<Bank[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-banks`, {
      params: { 'parentId.null': true }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const updateBank = async (id: number, data: Element): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-finance-banks/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deleteBank = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-finance-banks/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
