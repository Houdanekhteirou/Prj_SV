import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Budget } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

const fetchBudgets = async ({
  pageNumber = 0,
  pageSize = 20,
  all = false,
  title = ''
}: {
  pageSize: number
  pageNumber: number
  all?: boolean
  title?: string
}): Promise<{ data: Budget[]; count: number } | null> => {
  let resCount

  if (resCount) {
    resCount = (await axiosInstance.get(`/api/pbf-finance-budgets/count`)).data
  }
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-budgets`, {
      params: {
        page: pageNumber,
        size: all ? resCount : pageSize,
        sort: 'id,desc',
        ...(title && { 'title.contains': title })
      }
    })

    const count = (await axiosInstance.get(`/api/pbf-finance-budgets/count`)).data

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

const fetchOneBudget = async (id: number): Promise<Budget | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-budgets/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

const createBudget = async (data: Budget): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-finance-budgets`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

const updateBudget = async (id: number, data: Budget): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-finance-budgets/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

const deleteBudget = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-finance-budgets/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

export { fetchBudgets, fetchOneBudget, createBudget, updateBudget, deleteBudget }
