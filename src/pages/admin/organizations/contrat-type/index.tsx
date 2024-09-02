'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Grid } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TentityClass } from 'src/configs/traslationFields'
import { PERMISSIONS, col_contractType } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'

import { deleteContractType, fetchContractTypes } from 'src/api/entities/contractType'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

function ContractTypes() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    refetch()
  }, [name])

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data: contractTypes } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes
  })

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['contratTypes'],
    queryFn: fetchContractTypes
  })

  const handleModalTranslation = id => {
    const translations = data?.data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TentityClass,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteContractType(id)
    refetch()
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['entityclasses'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title='Contract Type'
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.entityClass.write}
                text={t('Add contract Type')}
              />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_contractType}
              data={data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              actions={[
                {
                  name: 'Edit',
                  icon: 'mdi:pencil-outline',
                  handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  color: 'primary',
                  requiredPermissions: [PERMISSIONS.entityClass.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  requiredPermissions: [PERMISSIONS.entityClass.delete]
                },
                {
                  name: 'Translate',
                  icon: 'mdi:translate',
                  handler: id => handleModalTranslation(id),
                  color: 'blue'
                }
              ]}
              refetchPagination={(page, rowsPerPage) => {
                setPagination({ pageNumber: page, pageSize: rowsPerPage })
              }}
              count={data?.count || 0}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// ContractTypes.acl = [PERMISSIONS.entityClass.read]
export default ContractTypes
