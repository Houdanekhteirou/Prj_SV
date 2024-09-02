import { FileType } from 'src/types/apis'
import axiosInstance from 'src/api/axiosInstance'

export const createFileTypeFrequency = async (data: any): Promise<{ success: boolean; id?: number }> => {
  try {
    const res = await axiosInstance.post(`/api/pbf-data-filetype-frequencies`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export const deleteFileTypeFrequency = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-data-filetype-frequencies/${id}`)

    const status200 = String(res.status).startsWith('2')
    return status200
  } catch (error) {
    console.error(error)
    return false
  }
}

export const deleteFileTypeFrequencyByTypeAndElementIds = async (
  elementId: number,
  fileTypeId: number
): Promise<boolean> => {
  try {
    const freq = (
      await axiosInstance.get(`/api/pbf-data-filetype-frequencies`, {
        params: {
          'frequencyId.equals': elementId,
          'filetypeId.equals': fileTypeId
        }
      })
    ).data.data[0]

    if (!freq) return false

    const res = await axiosInstance.delete(`/api/pbf-data-filetype-frequencies/${freq.id}`)

    const status200 = String(res.status).startsWith('2')
    return status200
  } catch (error) {
    console.error(error)
    return false
  }
}
