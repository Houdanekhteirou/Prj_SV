import axios from 'axios'
import axiosInstance from 'src/api/axiosInstance'

export const fetchRealTimeIndicators = async ({
  fromMonth,
  fromYear,
  toMonth,
  toYear,
  zoneId
}): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(
      `/api/real-time-data?fromMonth=${fromMonth}&fromYear=${fromYear}&toMonth=${toMonth}&toYear=${toYear}&zoneId=${zoneId}`
    )

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const filterZone = async (parentId): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones/filter?parentId=${parentId}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const filterEntities = async (zoneId: string): Promise<any | null> => {
  // /api/pbf-organization-entities/filter?
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entities/filter?zoneId=${zoneId}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchTopQualiIndicators = async ({ year, quarter, zoneId }): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(
      `/api/top-quality-files?year=${year ? year : ''}&quarter=${quarter ? quarter : ''}&zoneId=${zoneId ? zoneId : ''}`
    )

    return res.data.object
  } catch (error) {
    console.error(error)

    return null
  }
}

// /api/chart-quartly
const a = {
  totalValue: 123.45,
  langKey: 'en',
  quarter: 2,
  year: 2022,
  month: 3,
  typeChart: 1,
  titleOrdataElement: 'Indicator',
  entity: 'Data File',
  entityTypeId: 1,
  moughata: 47,
  verifiedValue: 67.89,
  total: 456.78,
  query: {
    key1: ['value1', 'value2'],
    key2: ['value3', 'value4']
  },
  listYears: [2020, 2021, 2022],
  listQuarters: [1, 2, 3, 4],
  listMonths: ['January', 'February', 'March'],
  listDataElements: ['Indicator1', 'Indicator2', 'Indicator3'],
  listOfDataElementsIds: [1, 2, 3],
  listOfMonths: [1, 2, 3],
  listOfBarcharts: [
    {
      label: 'Label1',
      value: 123
    },
    {
      label: 'Label2',
      value: 456
    }
  ],
  listOfBarchartNumber: [
    {
      name: 'Name1',
      number: 789
    },
    {
      name: 'Name2',
      number: 1011
    }
  ]
}

export const fetchChartQuartly = async (data): Promise<any | null> => {
  try {
    const res = await axiosInstance.post(`/api/chart-quartly`, {
      // totalValue: 123.45,
      // langKey: 'en',
      // quarter: 2,
      // year: 2022,
      // month: 3,
      typeChart: 0,
      // titleOrdataElement: 'Indicator',
      // entity: 'Data File',
      // entityTypeId: 1,
      // moughata: 47,
      // verifiedValue: 67.89,
      // total: 456.78,
      query: {
        key1: ['value1', 'value2'],
        key2: ['value3', 'value4']
      },
      listYears: [2020, 2021, 2022],
      listQuarters: [1, 2, 3, 4],
      listMonths: ['January', 'February', 'March'],
      listDataElements: ['Indicator1', 'Indicator2', 'Indicator3'],
      listOfDataElementsIds: [1, 2, 3],
      listOfMonths: [1, 2, 3],
      listOfBarcharts: [
        {
          label: 'Label1',
          value: 123
        },
        {
          label: 'Label2',
          value: 456
        }
      ],
      listOfBarchartNumber: [
        {
          name: 'Name1',
          number: 789
        },
        {
          name: 'Name2',
          number: 1011
        }
      ]
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

type DataElement = {
  id: string
  name: string
  zones: Array<{
    name: string
    [key: string]: any
  }>
  zone?: string
  month?: string
  year: string
  created_at: any
  contact_person: string
}

export const fetchDataManagement = async (): Promise<DataElement[] | null> => {
  try {
    const res = await axiosInstance.get('/api/v1/organization/entities')

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchLogs = async (): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/sys-logs`)

    return res.data
  } catch (error) {
    return null
  }
}

// /api/v1/dashbord/complutdePriveeFileType?year=2023&quarter=1
export const fetchCompletudePriveeFileType = async (year, quarter): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/v1/dashbord/complutdePriveeFileType?year=${year}&quarter=${quarter}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchRemaningEntities = async (year, monthOrQuarter, fileType): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/dashbord/remaningEntities?year=${year}&monthOrQuarter=${monthOrQuarter}&fileType=${fileType}`
    )

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchRealTimeResult = async (zoneId: string): Promise<any | null> => {
  const locale = localStorage.getItem('i18nextLng')

  return axios.get(`/api/v1/dashbord/tempReelPBF/?zoneId=${zoneId ? zoneId : ''}&locale=${locale}`)
}

export const fetchQuanities = async (zoneId: string): Promise<any | null> => {
  const locale = localStorage.getItem('i18nextLng')

  return axios.get(`/api/v1/dashbord/pbfquantite/?zoneId=${zoneId ? zoneId : ''}&locale=${locale}`)
}

export const fetchQualities = async (zoneId: string): Promise<any | null> => {
  const locale = localStorage.getItem('i18nextLng')

  return await axios.get(
    `/api/v1/dashbord/pbfqualite/${zoneId ? '?zoneId=' + zoneId : ''}${
      zoneId ? '&locale=' + locale : '?locale=' + locale
    }`
  )
}

export const fetchdataByZoneElement = async (elementId: string, parentId = ''): Promise<any | null> => {
  const locale = localStorage.getItem('i18nextLng')

  return await axios.get(
    `/api/pbf-data-by-zone-by-element/?elementId=${elementId ? elementId : ''}${
      parentId ? '&parentId=' + parentId : ''
    } &locale=${locale}`
  )
}

export const saveDocs = async (file, type): Promise<any> => {
  try {
    const formData = new FormData()

    formData.append('file', file)

    // if file is string return null
    if (typeof file === 'string' || !file || file === null)
      return {
        success: true,
        path: file
      }
    if (file.type.includes('svg')) {
      type = 'file'
    }

    const res = await axiosInstance.post(`/api/asset/${type}`, formData)
    if (res.status == 200) {
      return {
        success: true,
        path: res.data.message
      }
    }

    return {
      success: false,
      path: null
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      path: null
    }
  }
}

export const updateDocs = async (file, type, OldFileName): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/api/asset`, {
      params: {
        filepaths: OldFileName
      }
    })
    if (res.status == 200) {
      const formData = new FormData()
      formData.append('file', file)

      const res = await axiosInstance.post(`/api/asset/${type}`, formData)
      if (res.status == 200) {
        return {
          success: true,
          path: res.data.message
        }
      }
    }

    return {
      success: false,
      path: null
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const saveDocsToReposisotry = async ({
  file,
  repositoryId = null,
  repositoryTitle = null,
  newFileName = null
}: any): Promise<any> => {
  try {
    if (!repositoryId && !repositoryTitle) {
      return {
        success: false,
        message: 'repositoryId or repositoryTitle is required'
      }
    }

    // if file is string return null
    if (typeof file === 'string' || !file || file === null || typeof file === 'number')
      return {
        success: true,
        resourceId: file
      }

    const formData = new FormData()
    const fileName = newFileName ? newFileName : file.name

    if (repositoryId) {
      formData.append('repositoryId', repositoryId)
    }

    if (repositoryTitle) {
      formData.append('repositoryTitle', repositoryTitle)
    }

    formData.append('resourceFile', file, fileName)
    formData.append('protectedField', false)

    const res = await axiosInstance.post('/api/pbf-media-resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res) {
      return {
        success: true,
        resourceId: res.data.id,
        data: res.data
      }
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: error?.response?.data?.errorKey ? error?.response?.data?.errorKey : 'unknown_error'
    }
  }
}

// /pbf-media-resources/{id} delete file
export const deleteFile = async (id: string): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-media-resources/${id}`)

    return res
  } catch (error) {
    console.error(error)

    return null
  }
}

// /pbf-media-resources/multiple

export const translate = async (id, translation, endPoind): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/api/${endPoind}/${id}`, {
      id,
      translations_origine: JSON.stringify(translation)
    })

    if (res.status === 200) {
      return {
        success: true
      }
    }

    return {
      success: false
    }
  } catch (e) {
    return
  }
}

export const fetchGeoJson = async (): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/api/public/pbf-geo-zones`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// /api/pbf-organization-entities/filter?zoneId=33

export const fetchZoneDropdown = async ({ parentId }: { zoneId?: string; parentId?: string }): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones/filter${parentId ? '?parentId=' + parentId : ''}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchFile = async (id: string): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/resource/${id}-R`, {
      // responseType: 'blob'
    })

    console.log(res)

    return res
  } catch (error) {
    console.error(error)

    return null
  }
}
