import axiosInstance from 'src/api/axiosInstance'

export const fetchPermissions = async ({}: {}): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-permissions`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOnePermission = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-permissions/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const updatePermission = async (id: number, data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-user-permissions/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200 && !!res.data.id
  } catch (error) {
    console.error(error)

    return false
  }
}
