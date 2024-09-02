import axiosInstance from 'src/api/axiosInstance'
import { Contract, ContractType } from 'src/types/apis'
import { deleteFile, saveDocs, saveDocsToReposisotry } from '../other'
import { repoEnum } from 'src/constants'

const getstautsFilter = (status: string) => {
  const date = new Date().toISOString().split('T')[0]
  switch (status) {
    case 'all':
      return {
        'nextId.specified': false
      }
    case 'valid':
      return {
        'nextId.specified': false,
        'endDate.greaterThan': date
      }
    case 'expired':
      return {
        'nextId.specified': false,
        'endDate.lessThan': date
      }
    case 'history':
      return {
        'nextId.specified': true
      }
    default:
      return {
        'nextId.specified': false
      }
  }
}
export const fetchContracts = async ({
  pageNumber,
  pageSize,
  zoneId,
  entityId,
  contractType = null,
  entitytype = null,
  status = ''
}: {
  pageNumber: number
  pageSize: number
  zoneId: string | null
  entityId: string | null
  contractType: string | null
  entitytype: string | null
  status?: string | null
}): Promise<{ count: number; data: Contract[] } | null> => {
  try {
    const count = (
      await axiosInstance.get(`/api/pbf-organization-contracts/count`, {
        params: {
          zoneId: zoneId,
          'entityId.equals': entityId,
          'contracttypeId.equals': contractType,
          entitytypeId: entitytype,
          ...getstautsFilter(status)
        }
      })
    ).data

    const res = await axiosInstance.get(`/api/pbf-organization-contracts`, {
      params: {
        page: pageNumber,
        size: pageSize,
        zoneId: zoneId,
        'entityId.equals': entityId,
        sort: 'id,desc',
        'contracttypeId.equals': contractType,
        entitytypeId: entitytype,
        ...getstautsFilter(status)
      }
    })

    return { count: count, data: res.data.data }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchContractsByEntityId = async ({ id }: { id: number }): Promise<any | null> => {
  try {
    const count = (await axiosInstance.get(`/api/pbf-organization-contracts/count`)).data

    const res = await axiosInstance.get(`/api/pbf-organization-contracts`, {
      params: {
        size: count,
        'entityId.equals': id
      }
    })

    console.log('res', res.data.data)

    return res.data.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOneContract = async (id: number): Promise<any | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-organization-contracts/${id}`)

    return { ...res.data }
  } catch (error) {
    console.error(error)

    return null
  }
}

export function incrementDateByMonths(inputDate: Date | string, m: number) {
  const date = new Date(inputDate)
  date.setMonth(date.getMonth() + m)

  return date
}

export const createContract = async (
  data: Contract,
  consttractType: ContractType
): Promise<{ success: boolean; id?: number }> => {
  try {
    data.number = `${
      // only the first 4 characters of the entity name
      consttractType?.name?.substring(0, 3) || 'CONTRAT'
    }-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}
    -${Math.floor(Math.random() * 1000)}`

    data.endDate = incrementDateByMonths(data.startDate, consttractType?.duration)

    const saveRes = await saveDocs(data.contractPath, 'file')
    let res

    if (saveRes.success) {
      data.contractPath = saveRes.path
      res = await axiosInstance.post(`/api/pbf-organization-contracts`, {
        ...data
      })
    } else {
      return { success: false, message: 'Erreur' }
    }

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const createContractObject = async ({
  formData,
  contract,
  consttractType,
  renewing = true
}): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    // const resFile = await saveDocsToReposisotry({ file: formData.resourceFile, repositoryTitle: repoEnum.CONTRACTS })
    // if (!resFile?.success) return { success: false, message: resFile.message }

    let endDate = incrementDateByMonths(formData.startDate, consttractType?.duration)
    if (new Date(endDate).getFullYear() > new Date(formData.startDate).getFullYear()) {
      endDate = new Date(new Date(formData.startDate).getFullYear(), 11, 31)
    }

    const data = {
      startDate: formData.startDate,
      contracttypeId: formData.contracttypeId,
      contractPath: formData.contractPath,
      endDate: endDate,
      contact: {
        previousId: contract?.contact?.id || null,
        name: formData.contactName,
        phoneNumber: formData.phoneNumber,
        openingDate: formData.startDate,
        email: formData.email
      },
      account: {
        previousId: contract?.account?.id || null,
        id: contract?.account?.id,
        number: formData.accountNumber,
        bankId: formData.bankId,
        openingDate: formData.startDate,
        name: formData.accountName
      },
      signatory: formData.signatory,
      signatoryFunction: formData.signatoryFunction,
      entityId: contract.entityId,
      resourceId: formData.resourceId,
      previousId: contract.id,
      renewing: renewing,
      zoneId: formData?.zoneId,
      comment: formData?.comment
    }

    return { data, success: true }
  } catch (error) {
    console.error(error)

    throw error
  }
}

export const renewContract = async ({
  formData,
  contract,
  consttractType
}): Promise<{ success: boolean; id?: number }> => {
  try {
    const contractObject = await createContractObject({ formData, contract, consttractType })

    if (!contractObject.success) return { success: false }

    const res = await axiosInstance.post(`/api/pbf-organization-contracts`, {
      ...contractObject.data
    })

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    throw error
  }
}

export const renewMultipleContracts = async ({
  data
}: {
  data: {
    formData: any
    contract: any
    consttractType: any
  }[]
}): Promise<{ success: boolean; id?: number }[]> => {
  try {
    const contractObjects = await data.reduce(async (promiseChain, item) => {
      const chain = await promiseChain
      const res = await createContractObject(item)
      if (!res.success) {
        chain.forEach(async contractObject => {
          await deleteFile(contractObject.resourceId)
        })

        throw res
      }
      chain.push(res.data)

      return chain
    }, Promise.resolve([]))

    console.log('contractObjects', contractObjects)

    // return
    try {
      const res = await axiosInstance.post(`/api/pbf-organization-contracts/renew`, contractObjects)
    } catch (error) {
      console.error(error)
      throw error
    }

    return contractObjects
  } catch (error) {
    console.error(error)

    throw { success: false, message: error.message }
  }
}

// /pbf-organization-contracts/suspend
export const suspendContract = async ({ suspension, replacement, isPrimary }): Promise<boolean> => {
  try {
    if (!isPrimary) {
      const res = await axiosInstance.post(`/api/pbf-organization-contracts-suspensions`, {
        suspension,
        replacement: null
      })

      const status200 = String(res.status).startsWith('2')
    }

    const newReplacement = await createContractObject({
      formData: replacement.formData,
      contract: replacement.contract,
      consttractType: replacement.consttractType
    })

    if (!newReplacement.success) return false

    const res = await axiosInstance.post(`/api/pbf-organization-contracts-suspensions`, {
      suspension,
      replacement: newReplacement.data
    })

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    throw error
  }
}

// /pbf-organization-contracts/relocate
// {
//   "relocated": {},
//   "replacement": {}
// }

export const relocateContract = async ({ relocated, replacement, isPrimary }): Promise<boolean> => {
  try {
    const newRelocated = await createContractObject({
      formData: relocated.formData,
      contract: relocated.contract,
      consttractType: relocated.consttractType
    })

    if (!isPrimary) {
      const res = await axiosInstance.post(`/api/pbf-organization-contracts/relocate`, {
        relocated: newRelocated.data,
        replacement: null
      })

      const status200 = String(res.status).startsWith('2')

      return status200
    }

    const newReplacement = await createContractObject({
      formData: replacement.formData,
      contract: replacement.contract,
      consttractType: replacement.consttractType
    })

    if (!newReplacement.success) return false

    const res = await axiosInstance.post(`/api/pbf-organization-contracts/relocate`, {
      relocated: newRelocated.data,
      replacement: newReplacement.data
    })

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    throw error
  }
}

export const updateContract = async (id: number, data: Contract): Promise<{ success: boolean; id?: number }> => {
  try {
    data.id = id
    const res = await axiosInstance.patch(`/api/pbf-organization-contracts/${id}`, data)

    const status200 = String(res.status).startsWith('2')

    return { success: status200, id: res.data.id }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}
export const deleteContract = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-organization-contracts/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    throw error
  }
}
