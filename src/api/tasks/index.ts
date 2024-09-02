import axiosInstance from 'src/api/axiosInstance'

//http://localhost:8080/api/pbf-tasks/

export const getTasks = async () => {
  try {
    const res = await axiosInstance.get(`/api/pbf-tasks`)

    return res.data
  } catch (error) {
    throw error
  }
}

export const getTask = async id => {
  try {
    const res = await axiosInstance.get(`/api/pbf-tasks/${id}/`)

    return res.data
  } catch (error) {
    throw error
  }
}
