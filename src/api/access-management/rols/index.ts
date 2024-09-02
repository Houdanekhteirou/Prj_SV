import axiosInstance from 'src/api/axiosInstance'

export const fetchRoles = async ({}: {}): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-roles`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneRole = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-roles/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const updateRole = async (id: number, data: any): Promise<boolean> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-user-roles/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200 && !!res.data.id
  } catch (error) {
    console.error(error)

    return false
  }
}

export const createRole = async (data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-user-roles`, JSON.stringify(data), {
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

export const deleteRole = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-user-roles/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(error)

    return false
  }
}
