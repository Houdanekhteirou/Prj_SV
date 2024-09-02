import axiosInstance from '../axiosInstance'

export const fetchPbfConfigurations = async () => {
  try {
    const response = await axiosInstance.get('/api/pbf-configurations')

    return response.data
  } catch (error) {
    throw error
  }
}

export const updatePbfConfiguration = async (data: any) => {
  try {
    const response = await axiosInstance.patch(`/api/pbf-configurations/${data.id}`, data)

    return response.data
  } catch (error) {
    throw error
  }
}
