//
import { s } from '@fullcalendar/core/internal-common'
import axiosInstance from 'src/api/axiosInstance'

export const fetchWidgets = async ({ uid, name }) => {
  try {
    const res = await axiosInstance.get(`/api/pbf-app-widgets`, {
      params: {
        'uid.equals': uid,
        'name.equals': name
      }
    })

    return res.data[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateWidget = async ({ id, data }) => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-app-widgets/${id}`, data)

    return {
      success: true
    }
  } catch (error) {
    console.error(error)

    return {
      success: false
    }
  }
}
