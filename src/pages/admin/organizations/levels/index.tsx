'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SectionTitle from 'src/@core/components/SectionTItle'

import { Button, Card, CardContent, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { deleteLevel, fetchLevels } from 'src/api/organizations/levels'
import { col_levels } from 'src/constants'
import { PERMISSIONS } from 'src/constants'
import { TFileType } from 'src/configs/traslationFields'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

function Levels() {
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

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['Levels', pagination, name],
    queryFn: async () => {
      const res = await fetchLevels({
        ...pagination,
        name: name
      })
      const newData = res?.data.map(el => ({
        ...el,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr')
      }))

      return { count: res?.count, data: newData }
    }
  })

  const handleModalTranslation = id => {
    const translations = data?.data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TFileType,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteLevel(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['Levels'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('Niveaux')}
            total={data?.count}
            addButton={
              <AddButton pathname={pathname} requiredPermissions={PERMISSIONS.zone.write} text={t('Add Level')} />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_levels}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'Name',
                  onChange: e => setName(e.target.value),
                  value: name,
                  type: 'text'
                }
              ]}
              actions={[
                {
                  name: 'Edit',
                  icon: 'mdi:pencil-outline',
                  handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  color: 'primary',
                  requiredPermissions: [PERMISSIONS.zone.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.zone.delete]
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
          path='pbf-organization-levels'
        />
      )}
    </Grid>
  )
}

Levels.acl = [PERMISSIONS.zone.read]
export default Levels
