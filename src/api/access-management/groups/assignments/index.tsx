// GET http://localhost:8080/api/pbf-user-group-access

// PUT http://localhost:8080/api/pbf-user-group-access

// ###
// POST http://localhost:8080/api/pbf-user-group-access

// ###
// GET http://localhost:8080/api/pbf-user-group-access/{{id}}

// ###
// PATCH http://localhost:8080/api/pbf-user-group-access/{{id}}

import axiosInstance from 'src/api/axiosInstance'

export const fetchPbfUserGroupAccess = async ({ groupId }): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-group-access`, {
      params: {
        'groupId.equals': groupId
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOnePbfUserGroupAccess = async (id: number): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-group-access/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createPbfUserGroupAccess = async (data: any): Promise<any> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-user-group-access`, data)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const updatePbfUserGroupAccess = async (id: number, data: any): Promise<any> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-user-group-access/${id}`, data)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const patchPbfUserGroupAccess = async (id: number, data: any): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-user-group-access/${id}`, data)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}
