import axiosInstance from '../axiosInstance'

// api/pbf-reports

export const fetchPbfReports = async ({
  pageNumber = 0,
  pageSize = 12,
  params = {}
}: {
  pageSize?: number
  pageNumber?: number
  params?: any
}): Promise<any | null> => {
  try {
    const count = (
      await axiosInstance.get('/api/pbf-reports/count', {
        params: {
          ...params
        }
      })
    ).data
    const res = await axiosInstance.get('/api/pbf-reports', {
      params: {
        page: pageNumber,
        size: pageSize,
        ...params
      }
    })

    return {
      data: res.data,
      count: count
    }
  } catch (error) {
    throw error
  }
}

export const fetchPbfReport = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-reports/${id}`)

    return res.data
  } catch (error) {
    throw error
  }
}

export const signPbfReport = async (id: number, data: any): Promise<any | null> => {
  try {
    const res = await axiosInstance.patch(`/api/pbf-reports/${id}`, data)

    return res.data
  } catch (error) {
    throw error
  }
}
