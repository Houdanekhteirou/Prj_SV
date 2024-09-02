'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Grid } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import { deleteEntityType, fetchEntityTypes } from 'src/api/entities/entitytype'
import { PERMISSIONS } from 'src/constants'
import { TentityClass } from 'src/configs/traslationFields'
import { col_entity_type } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

function Entity_Types() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [title, setTitle] = useState('')

  useEffect(() => {
    refetch()
  }, [title])

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['entitytypes', pagination, title],
    queryFn: async () => {
      const res = await fetchEntityTypes({
        ...pagination,
        title: title
      })
      const newData = res?.data.map(el => ({
        ...el,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr'),
        image: (
          <img
            src={process.env.NEXT_PUBLIC_API_URP + '/' + el.code}
            alt={el.name}
            style={{ width: '50px', height: '50px' }}
          />
        )
      }))

      return { count: res?.count, data: newData }
    }
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
    const res = await deleteEntityType(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['entitytypes'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title='entityTypes'
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.entityType.write}
                text={t('Add Entity Type')}
              />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_entity_type}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'Title',
                  onChange: e => setTitle(e.target.value),
                  value: title,
                  type: 'text'
                }
              ]}
              actions={[
                {
                  name: 'Edit',
                  icon: 'mdi:pencil-outline',
                  handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  color: 'primary',
                  requiredPermissions: [PERMISSIONS.entityType.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.entityType.delete]
                },
                {
                  name: 'Translate',
                  icon: 'mdi:translate',
                  handler: id => handleModalTranslation(id),
                  color: 'blue'
                },
                {
                  name: 'View',
                  icon: 'mdi:eye-outline',
                  handler: id => router.push(`${pathname}/form?mode=view&id=${id}`),
                  color: 'green'
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
      {modalData && (
        <TranslationComponentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          translations={modalData?.translations}
          fields={modalData?.fields}
          elementId={modalData?.elementId}
          path='pbf-organization-entitytypes'
        />
      )}
    </Grid>
  )
}

Entity_Types.acl = [PERMISSIONS.entityType.read]

export default Entity_Types
