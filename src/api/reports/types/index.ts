import axiosInstance from 'src/api/axiosInstance'

export const fetchPbfReportTypes = async (): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get('/api/pbf-report-types')

    return res.data
  } catch (error) {
    throw error
  }
}

export const fetchPbfReportType = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-report-types/${id}`)

    return res.data
  } catch (error) {
    throw error
  }
}

export const createPbfReportType = async (data: any): Promise<any | null> => {
  try {
    const res = await axiosInstance.post('/api/pbf-report-types', data)

    return res.data
  } catch (error) {
    throw error
  }
}

export const updatePbfReportType = async (id: number, data: any): Promise<any | null> => {
  data.id = id
  try {
    const res = await axiosInstance.patch(`/api/pbf-report-types/${id}`, data)

    return res.data
  } catch (error) {
    throw error
  }
}

// GET http://localhost:8080/api/pbf-reports/report?
//     reportTypeId={{$random.integer(100)}}&
//     zoneId={{$random.integer(100)}}&
//     entityId={{$random.integer(100)}}&
//     year={{$random.integer(100)}}&
//     month={{$random.integer(100)}}&
//     quarter={{$random.integer(100)}}

export const fetchPbfReport = async (params: any): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get('/api/pbf-reports/report', { params })

    return res.data
  } catch (error) {
    throw error
  }
}
