import axiosInstance from '../axiosInstance'

// GET /entityclass

// Query Parameters:

// entities_class_id (int, optional)
// name (str, optional)
// locale (str, optional, default='fr')

// GET /entitytype

// Query Parameters:

// entityClassId (int, optional, default=0)
// locale (str, optional, default='fr')

// GET /zone

// Query Parameters:

// levelId (int, optional, default=0)
// parentId (int, optional, default=0)
// locale (str, optional, default='fr')

// GET /entity

// Query Parameters:

// zone_id (int, optional, default=0)
// entityClassId (int, optional, default=0)
// entityTypeId (int, optional, default=0)
// locale (str, optional, default='fr')

// GET /filetype

// Query Parameters:

// entityTypeId (int, optional, default=0)
// frequencyId (int, optional, default=0)
// locale (str, optional, default='fr')

// GET /api/real-time-data

// Body  (RealtimeResultRequest):

// fromMonth (int, optional, default=0)
// toMonth (int, optional, default=0)
// fromYear (int, optional, default=0)
// toYear (int, optional, default=0)
// zoneId (int, optional, default=0)
// locale (str, optional, default='fr')

export const get_entityclass = async (params: { entities_class_id?: number; name?: string; locale?: string }) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_PYTHON}/entityclass`, { params })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const get_entitytype = async (params: { entityClassId?: number; locale?: string }) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_PYTHON}/entitytype`, { params })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const get_zone = async (params: { levelId?: number; parentId?: any; locale?: string }) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_PYTHON}/zone`, { params })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const get_entity = async (params: {
  zone_id?: number
  entityClassId?: number
  entityTypeId?: number
  locale?: string
}) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_PYTHON}/entity`, { params })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const get_filetype = async (params: { entityTypeId?: number; frequencyId?: number; locale?: string }) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_PYTHON}/filetype`, { params })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const get_real_time_data = async (params: {
  fromMonth?: number
  toMonth?: number
  fromYear?: number
  toYear?: number
  zoneId?: number
  locale?: string
}) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_PYTHON}/api/real-time-data`, { params })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
