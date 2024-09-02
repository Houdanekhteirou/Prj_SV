import axiosInstance from 'src/api/axiosInstance'
// api/pbf-user-group-members

export const fetchGroupMembers = async ({
  pageNumber = 0,
  pageSize = null,
  groupId = null,
  userId = null,
  all = false
}): Promise<{
  data: any
  count: number
} | null> => {
  try {
    const count = (
      await axiosInstance.get(`/api/pbf-user-group-members/count`, {
        params: {
          'groupId.equals': groupId || null,
          'userId.equals': userId
        }
      })
    ).data

    const res = await axiosInstance.get(`/api/pbf-user-group-members`, {
      params: {
        page: pageNumber,
        size: all ? count : pageSize,
        'groupId.equals': groupId || null,
        'userId.equals': userId
      }
    })

    return { data: res.data, count }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneGroupMember = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-group-members/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createGroupMember = async (data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-user-group-members`, JSON.stringify(data), {
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

export const updateGroupMember = async (id: number, data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-user-group-members/${id}`, JSON.stringify(data), {
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

export const deleteGroupMember = async (id: number): Promise<{ success: boolean }> => {
  try {
    await axiosInstance.delete(`/api/pbf-user-group-members/${id}`)

    return { success: true }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
