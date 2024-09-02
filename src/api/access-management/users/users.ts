import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import axiosInstance from 'src/api/axiosInstance'

import { User } from 'src/types/apis' // Adjust the import path based on your project structure

export const fetchUsers = async ({
  pageNumber = 0,
  pageSize = 12,
  all = false,
  combined = ''
}: {
  pageSize?: number
  pageNumber?: number
  name?: string
  all?: boolean
  combined?: string
}): Promise<User[] | null> => {
  try {
    const options = {}
    if (combined) {
      options['combined.contains'] = combined
    }

    const count = (
      await axiosInstance.get(`/api/pbf-user-accounts/count`, {
        params: {
          ...options
        }
      })
    ).data

    const res = await axiosInstance.get(`/api/pbf-user-accounts`, {
      params: {
        page: pageNumber,
        size: all ? count : pageSize,
        ...options,
        sort: 'id,desc'
      }
    })

    return {
      data: res.data,
      count: count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneUser = async (id: number): Promise<User | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-accounts/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createUser = async (data: User): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-user-accounts`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(error)

    return false
  }
}

export const updateUser = async (id: number, data: User): Promise<boolean> => {
  try {
    if (data.password === '') {
      delete data.password
    }
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-user-accounts/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200 && !!res.data.id
  } catch (error) {
    console.error(error)

    return false
  }
}
// POST /api/account/change-password?
// userId

export const changePassword = async ({
  userId = null,
  data
}: {
  userId?: number | null
  data: { currentPassword: string; newPassword: string }
}): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/account/change-password${userId ? `/?userId=${userId}` : ''}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(error)

    return false
  }
}

// /api/account/signature

export const changeSignature = async (data: { signature: string }): Promise<boolean> => {
  try {
    const formData = new FormData()
    formData.append('signature', data.signature)
    const res = await axiosInstance.post(`/api/account/signature`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    throw error
  }
}

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-user-accounts/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
