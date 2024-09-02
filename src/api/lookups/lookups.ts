import axiosInstance from 'src/api/axiosInstance'

export const fetchLookups = async ({
  pbfLookups,
  locale
}: {
  locale?: string
  pbfLookups?: string
}): Promise<{ data: any[]; count: number } | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-lookups`, {
      params: {
        lookupName: pbfLookups,
        lang: locale
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}
