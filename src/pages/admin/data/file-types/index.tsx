'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { deleteFileType, fetchFileTypes } from 'src/api/data/filetype'
import { col_file_type } from 'src/constants'
import { TFileType } from 'src/configs/traslationFields'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import { PERMISSIONS } from 'src/constants'
import { useAuth } from 'src/hooks/useAuth'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

import AddButton from 'src/layouts/components/acl/AddButton'

function FileTypes() {
  const { t } = useTranslation()
  const auth = useAuth()
  const { authorities } = auth.user

  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 25 })

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
    queryKey: ['FileTypes', pagination, name],
    queryFn: async () => {
      const res = await fetchFileTypes({
        ...pagination,
        name: name
      })
      const newData = res?.data.map(el => ({
        ...el,
        frequency: el.frequency.name,
        template: el.template === 'qlty_evaluation' ? t('qlty_evaluation') : t('qtty_evaluation'),
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
    const res = await deleteFileType(id)
    if (res) {
      toast.success(fileOperations.delete.successMessage)
      refetch()
    } else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['filetypes'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={'fileTypes'}
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.fileType.write}
                text={t('Add File Type')}
              />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_file_type}
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
                  requiredPermissions: [PERMISSIONS.fileType.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.fileType.delete]
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
                },
                // assignments
                {
                  name: 'Assignments',
                  icon: 'mdi:eye-outline',
                  handler: id => router.push(`${pathname}/assignments?id=${id}`),
                  color: 'green'
                }
              ]}
              refetchPagination={(page, rowsPerPage) => {
                setPagination({ pageNumber: page, pageSize: rowsPerPage })
              }}
              count={data?.count}
              pagination={pagination}
              columnOrder='title'
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
          path='pbf-data-filetypes'
        />
      )}
    </Grid>
  )
}

FileTypes.acl = [PERMISSIONS.fileType.read]

export default FileTypes
