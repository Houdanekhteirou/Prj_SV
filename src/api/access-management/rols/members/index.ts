import axiosInstance from 'src/api/axiosInstance'

export const fetchRoleMembers = async ({
  userId = null,
  roleId = null,
  pageNumber = 0,
  pageSize = null
}: any): Promise<{
  data: any
  count: number
} | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-role-members`, {
      params: {
        'userId.equals': userId,
        'roleId.equals': roleId,
        page: pageNumber,
        size: pageSize,
        sort: 'id,desc'
      }
    })

    const count = (
      await axiosInstance.get(`/api/pbf-user-role-members/count`, {
        params: {
          'userId.equals': userId,
          'roleId.equals': roleId
        }
      })
    ).data

    return { data: res.data, count }
  } catch (error) {
    console.error(error)
    return null
  }
}

export const fetchOneRoleMember = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-role-members/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createRoleMember = async (data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-user-role-members`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res.status === 201
  } catch (error) {
    console.error(error)

    return false
  }
}

export const updateRoleMember = async (id: number, data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-user-role-members/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res.status === 200
  } catch (error) {
    console.error(error)

    return false
  }
}

export const deleteRoleMember = async (id: number): Promise<{ success: boolean }> => {
  try {
    await axiosInstance.delete(`/api/pbf-user-role-members/${id}`)

    return { success: true }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
