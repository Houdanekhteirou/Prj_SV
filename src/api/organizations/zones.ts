import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Zone } from 'src/types/apis'
import { fetchOneLevelByItsLevel } from './levels'
import axiosInstance from 'src/api/axiosInstance'

export const fetchAllZones = async (): Promise<Zone[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones/wilayas`)

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchZones = async ({
  pageNumber = 0,
  pageSize = 15,
  name = '',
  all = false,
  parentId = null
}: {
  pageSize?: number
  pageNumber?: number
  name?: string
  all?: boolean
  parentId?: number
}): Promise<{ data: Zone[]; count: number } | null> => {
  try {
    const options: any = {}

    const count = (await axiosInstance.get(`/api/pbf-organization-zones/count`)).data

    if (name) {
      options['name.contains'] = name
    }

    if (pageSize || pageNumber) {
      options.size = pageSize
      options.page = pageNumber
    }

    if (parentId) {
      options['parentId.equals'] = parentId
    }

    if (all) {
      options.size = count
    }
    const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
      params: {
        ...options,
        sort: 'id,desc'
      }
    })

    return {
      data: res.data.data,
      count: count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchZoneByEntity = async (zoneId: number): Promise<Zone | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones/${zoneId}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchZonesByLevel = async (level: number, zoneId?: number, all = false): Promise<Zone[] | null> => {
  try {
    // const theLevel = await fetchOneLevelByItsLevel(level);
    // if (!theLevel) return null;
    let count
    let params: any = { 'levelId.equals': level }
    if (zoneId) {
      params = { 'parentId.equals': zoneId }
    }

    count = (await axiosInstance.get(`/api/pbf-organization-zones/count`)).data
    params.size = count

    const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
      params: params
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchZonesByUser = async (): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones-by-user`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchMoughataasByWilayaId = async (wilayaId: number): Promise<Zone[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
      params: { 'parentId.equals': wilayaId }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}
export const fetchZonesSanitairesByMoughataaId = async (moughtaaId: number): Promise<Zone[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
      params: { 'parentId.equals': moughtaaId }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// export const fetchZonesMoughtaas = async (): Promise<{
//   data: Zone[];
//   count: number;
// } | null> => {
//   try {
//     const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
//       params: { "levelId.equals": 3 },
//     });

//     return res.data.data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// export const fetchZonesSanitaires = async (): Promise<{
//   data: Zone[];
//   count: number;
// } | null> => {
//   try {
//     const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
//       params: { "levelId.equals": 5 },
//     });

//     return res.data.data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

export const fetchZonesByLevelId = async (levelId: number): Promise<{ data: Zone[]; count: number } | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones`, {
      params: { 'levelId.equals': levelId }
    })

    const count = (await axiosInstance.get(`/api/pbf-organization-zones/count`)).data

    return {
      data: res.data.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneZone = async (id: number): Promise<Zone | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createZone = async (data: Zone): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-organization-zones`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200 && !!res.data.id, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const updateZone = async (id: number, data: Zone): Promise<{ success: boolean; id: number }> => {
  try {
    const res = await axiosInstance.put(`/api/pbf-organization-zones/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200 && !!res.data.id, id: res.data.id }
  } catch (error) {
    console.error(error)

    return false
  }
}
export const deleteZone = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-zones/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
