import axiosInstance from 'src/api/axiosInstance'

export const fetchGroupes = async ({
  pageNumber = 0,
  pageSize = null,
  all = false
}): Promise<{
  data: any
  count: number
} | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-user-groups/count`)).data

    const res = await axiosInstance.get(`/api/pbf-user-groups`, {
      params: {
        page: pageNumber,
        size: all ? count : pageSize
      }
    })

    // Use Promise.all to wait for all promises to resolve
    const newres = await Promise.all(
      res.data.map(async (group: any) => {
        const usersCount = (
          await axiosInstance.get(`/api/pbf-user-group-members/count`, {
            params: {
              'groupId.equals': group.id
            }
          })
        ).data

        return {
          ...group,
          usersCount
        }
      })
    )

    return { data: newres, count }
  } catch (error) {
    console.error(error)
    return null
  }
}

export const fetchOneGroupe = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-user-groups/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createGroupe = async (data: any): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-user-groups`, JSON.stringify(data), {
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

export const updateGroupe = async (id: number, data: any): Promise<boolean> => {
  try {
    data.id = id
    const res = await axiosInstance.put(`/api/pbf-user-groups/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return status200 && !!res.data.id
  } catch (error) {
    console.error(error)

    return false
  }
}

export const deleteGroupe = async (
  id: number
): Promise<{
  success: boolean
}> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-user-groups/${id}`)

    const status200 = String(res.status).startsWith('2')

    return { success: status200 }
  } catch (error) {
    console.error(error)

    return false
  }
}
