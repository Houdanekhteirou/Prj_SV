'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { deleteElementGroups, fetchElementGroups } from 'src/api/element-groups/element-groups'
import { col_element_group } from 'src/constants'
import { TFileType } from 'src/configs/traslationFields'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import { PERMISSIONS } from 'src/constants'

import SectionTitle from 'src/@core/components/SectionTItle'
import AddButton from 'src/layouts/components/acl/AddButton'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

function Elements_Group() {
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
    queryKey: ['elements_group', pagination, title],
    queryFn: async () => {
      const res = await fetchElementGroups({
        ...pagination,
        name: title
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
    const res = await deleteElementGroups(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['elements_group'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('element_groups')}
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.element.write}
                text={t('Add Element Group')}
              />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_element_group}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'title',
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
                  requiredPermissions: [PERMISSIONS.element.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.element.delete]
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
          path='pbf-data-element-groups'
        />
      )}
    </Grid>
  )
}

Elements_Group.acl = [PERMISSIONS.element.read]

export default Elements_Group
