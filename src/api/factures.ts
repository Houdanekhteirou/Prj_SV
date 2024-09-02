import axiosInstance from 'src/api/axiosInstance'

export const fetchWilayaFacture = async ({
  wilayaaid,
  year,
  month
}: {
  wilayaaid: number
  year: number
  month: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureWilayaa`, {
      params: {
        wilayaaid,
        year,
        month
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchMougataaFacture = async ({
  moughataaid,
  year,
  month
}: {
  moughataaid: number
  year: number
  month: number
}): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureMoughataa`, {
      params: {
        moughataaid,
        year,
        month
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchZoneFacture = async ({
  zoneid,
  year,
  month
}: {
  zoneid: number
  year: number
  month: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureZoneSanitaire`, {
      params: {
        zoneid,
        year,
        month
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchEntityFacture = async ({
  entityId,
  year,
  month
}: {
  entityId: number
  year: number
  month: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/facturemenseille`, {
      params: {
        entityId,
        year,
        month
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchFactureZoneSanitaireQuality = async ({
  zoneId,
  year,
  quater
}: {
  zoneId: number
  year: number
  quater: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureZoneSanitaireQuality`, {
      params: {
        zoneId,
        year,
        quater
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// /factureBonusQalite?entityId=42&year=2022&month=6

export const fetchFactureBonusQalite = async ({
  entityId,
  year,
  quarter
}: {
  entityId: number
  year: number
  quarter: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureBonusQalite`, {
      params: {
        entityId,
        year,
        quater: quarter
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

// {{prodUrl}}/api/factureQualiteaPerformance?entityId=187&year=2019&quarter=2

export const fetchFactureQualiteaPerformance = async ({
  entityId,
  year,
  quarter
}: {
  entityId: number
  year: number
  quarter: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureQualiteaPerformance`, {
      params: {
        entityId,
        year,
        quarter
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchFactureFosa = async ({
  wilayaId,
  year,
  quarter
}: {
  wilayaId: number
  year: number
  quarter: number
}): Promise<any[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/factureFosa`, {
      params: {
        wilayaId,
        year,
        quarter
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}
