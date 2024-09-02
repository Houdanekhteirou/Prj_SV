import axiosInstance from 'src/api/axiosInstance'

export const fetchValidatedFiles = async ({
  pageNumber = 0,
  pageSize = 15,
  fileType = null,
  entityClassId = null,
  entiyId = null,
  year = null,
  month = null,
  zoneId = null
}: {
  pageSize: number
  pageNumber: number
  fileType: number | null
  entityClassId?: number | null
  entiyId?: number | null
  year?: number | null
  month?: number | null
  zoneId?: number | null
}): Promise<{ data: any[]; count: number } | null> => {
  try {
    const options: any = fileType ? { 'filetypeId.equals': fileType } : {}
    if (entityClassId) {
      options['entityClassId'] = entityClassId
    }
    if (entiyId) {
      options['entityId.equals'] = entiyId
    }
    if (year) {
      options['year.equals'] = year
    }
    if (month) {
      options['month.equals'] = month
    }
    if (zoneId) {
      options['zoneId'] = zoneId
    }

    const res = await axiosInstance.get(`/api/pbf-data-files/validated`, {
      params: {
        page: pageNumber,
        size: pageSize,

        sort: 'id,desc',
        ...options
      }
    })

    // const count = (
    //   await axiosInstance.get(`/api/pbf-data-files/validated/count`, {
    //     params: {
    //       ...options
    //     }
    //   })
    // ).data

    return {
      data: res.data.data,
      count: res.data.object
    }
  } catch (error) {
    console.error(error)

    return null
  }
}
