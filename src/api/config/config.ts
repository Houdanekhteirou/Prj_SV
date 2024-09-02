import axiosInstance from 'src/api/axiosInstance'

export const fetchConfigs = async (): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-configurations`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const updateConfig = async (data: any): Promise<any | null> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-configurations/${data?.id}`, data)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchPermissionRequests = async (user): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(
      `/api/pbf-permission-requests`

      // {
      //   params: {
      //     "user.contains": user,
      //   },
      // }
    )

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const updatePermissionRequestStatus = async (data: any): Promise<any | null> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-permission-requests/${data?.id}`, data)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}
