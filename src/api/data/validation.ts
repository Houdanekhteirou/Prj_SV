import axiosInstance from '../axiosInstance'

//http://localhost:8080/api/pbf-tasks/instances?taskId.equals=1

export const getTaskInstances = async (params: any): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-tasks/instances`, {
      params
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const getTaskInstance = async (id: string): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-tasks/instances/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const validateTaskInstance = async (id: string): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-tasks/instances/validate?id=${id}`)

    return res.data
  } catch (error) {
    throw error
  }
}

export const publishTaskInstance = async (id: string): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-tasks/instances/publish?id=${id}`)

    return res.data
  } catch (error) {
    throw error
  }
}
