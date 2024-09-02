import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Bank, Entity } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'
import { saveDocs } from '../other'

// Update the fetchEntities function
export const fetchEntities = async ({
  pageNumber = 0,
  pageSize = 15,
  name = '',
  zoneId = ''
}: {
  pageSize: number
  pageNumber: number
  name?: string
  zoneId?: string
}): Promise<{ data: Entity[]; count: number } | null> => {
  try {
    const params: any = {
      page: pageNumber,
      size: pageSize
    }
    if (name) params['name.contains'] = name
    if (zoneId) params['zoneId.equals'] = zoneId

    const res = await axiosInstance.get(`/api/pbf-organization-entities`, {
      params: {
        ...params,
        sort: 'id,desc'
      }
    })

    const count = (
      await axiosInstance.get(`/api/pbf-organization-entities/count`, {
        params: {
          ...params
        }
      })
    ).data

    return {
      data: res.data.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchStatuses = async ({
  pageNumber,
  pageSize
}: {
  pageSize?: number
  pageNumber?: number
}): Promise<{ data: any; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-statuses/count`)).data

    const res = await axiosInstance.get(`/api/pbf-organization-statuses`, {
      params: {
        page: pageNumber || 0,
        size: pageSize || count

        // "name.contains": "fraud",
      }
    })

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchContractTypesInEntity = async ({
  pageNumber,
  pageSize
}: {
  pageSize?: number
  pageNumber?: number
}): Promise<{ data: any; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-contracttypes/count`)).data

    const res = await axiosInstance.get(`/api/pbf-organization-contracttypes`, {
      params: {
        page: pageNumber || 0,
        size: pageSize || count

        // "name.contains": "fraud",
      }
    })

    return {
      data: res.data.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchGroups = async ({
  pageNumber,
  pageSize
}: {
  pageSize?: number
  pageNumber?: number
}): Promise<{ data: any; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-groups/count`)).data

    const res = await axiosInstance.get(`/api/pbf-organization-groups`, {
      params: {
        page: pageNumber || 0,
        size: pageSize || count

        // "name.contains": "fraud",
      }
    })

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchTypes = async ({
  pageNumber,
  pageSize
}: {
  pageSize?: number
  pageNumber?: number
}): Promise<{ data: any; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-entitytypes/count`)).data

    const res = await axiosInstance.get(`/api/pbf-organization-entitytypes`, {
      params: {
        page: pageNumber || 0,
        size: pageSize || count

        // "name.contains": "fraud",
      }
    })

    return {
      data: res.data.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}
export const fetchBanksInEntity = async ({
  pageNumber,
  pageSize
}: {
  pageSize?: number
  pageNumber?: number
}): Promise<{ data: any; count: number } | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-finance-banks/count`)).data

    const res = await axiosInstance.get(`/api/pbf-finance-banks`, {
      params: {
        parentId: null, // Use parentId: null to filter by null values
        page: pageNumber || 0,
        size: pageSize || count

        // "name.contains": "fraud",
      }
    })

    return {
      data: res.data,
      count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchBanksByParent = async (bankParent: number): Promise<Bank[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-banks`, {
      params: { 'parentId.equals': bankParent }
    })

    return res.data // Ensure that the returned value includes the 'data' property
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchBanksByParentId = async (): Promise<Bank[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-finance-banks`, {
      params: { parentId: null } // Use parentId: null to filter by null values
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneEntity = async (id: number): Promise<Entity | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entities/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchEntitiesByZoneId = async ({
  zoneId,
  entityclassId
}: {
  zoneId: number
  entityclassId: number
}): Promise<Entity[] | null> => {
  try {
    const options = entityclassId ? { 'entityclassId.equals': entityclassId } : {}

    const res = await axiosInstance.get(`/api/pbf-organization-entities`, {
      params: {
        'zoneId.equals': zoneId,
        ...options
      }
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// Update the fetchZoneNameById function
export const fetchZoneNameById = async (zoneId: number): Promise<string | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-zones/${zoneId}`, {
      params: {
        'zoneId.equals': zoneId
      }
    })

    return res.data.name // Adjust the property name based on your actual API response
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchEntityTypeNameById = async (entitytypeId: number): Promise<string | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entitytypes/${entitytypeId}`, {
      params: {
        'entitytypeId.equals': entitytypeId
      }
    })

    return res.data.name // Adjust the property name based on your actual API response
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchStatusNameById = async (statusId: number): Promise<string | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-statuses/${statusId}`, {
      params: {
        'statusId.equals': statusId
      }
    })

    return res.data.name // Adjust the property name based on your actual API response
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchGroupesEntitiesById = async (groupId: number): Promise<string | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-groups/${groupId}`, {
      params: {
        'groupId.equals': groupId
      }
    })

    return res.data.name // Adjust the property name based on your actual API response
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createEntity = async (data: any): Promise<{ success: boolean; id?: number; message?: string }> => {
  try {
    let res
    const saveRes = await saveDocs(data.picturePath, 'img')
    const saveRes2 = await saveDocs(data.contract.contractPath, 'file')
    if (saveRes.success && saveRes2.success) {
      data.picturePath = saveRes.path
      data.contract.contractPath = saveRes2.path
      res = await axiosInstance.post(`/api/pbf-organization-entities`, data)
    } else {
      return { success: false, message: 'Erreur' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}

export const updateEntity = async (
  id: number,
  data: Entity
): Promise<{ success: boolean; id?: number; message?: string }> => {
  data.id = id
  let res
  try {
    const saveRes = await saveDocs(data.picturePath, 'img')
    const saveRes2 = await saveDocs(data.contractPath, 'file')
    if (saveRes.success && saveRes2.success) {
      data.picturePath = saveRes.path
      data.contractPath = saveRes2.path
      res = await axiosInstance.patch(`/api/pbf-organization-entities/${id}`, data)
    } else {
      return { success: false, message: 'Erreur' }
    }
    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    return { success: false, message: 'Ereur dans la creation' }
  }
}
export const deleteEntity = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-entities/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}

///api/pbf-organization-entities/filter
export const fetchEntitiesFilter = async (filter: any): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-entities/filter`, {
      params: filter
    })

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}
