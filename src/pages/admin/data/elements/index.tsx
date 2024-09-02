'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

import { Box } from '@mui/system'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { depsToOptions } from 'src/@core/utils'
import { deleteElement, fetchElements } from 'src/api/data/element'
import { fetchFileTypes } from 'src/api/data/filetype'
import { col_element } from 'src/constants'
import { TFileType } from 'src/configs/traslationFields'
import { PERMISSIONS } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'
import { FileOperation, fileOperations } from 'src/@core/components/FileOperations'

function Element() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [name, setName] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [fileType, setFileType] = useState<number | null>(null)

  const { data: fileTypes } = useQuery({
    queryKey: ['filetypes'],
    queryFn: () => fetchFileTypes({})
  })

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['elements', pagination, name, fileType],
    queryFn: async () => {
      const res = await fetchElements({
        ...pagination,
        name: name,
        fileType: fileType!
      })

      const newData = res?.data.object.map(el => ({
        ...el,
        units: el.unitLabel.title,
        vartype: el.vartypeLabel.title,
        image: (
          <img
            src={process.env.NEXT_PUBLIC_API_URP + '/' + el.iconFile}
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
      fields: TFileType,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteElement(id)
    if (res.success) {
      toast.success(fileOperations.delete.successMessage)
      refetch()
    } else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['elements'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={'les_indicateurs'}
            total={data?.count}
            addButton={
              <AddButton pathname={pathname} requiredPermissions={PERMISSIONS.element.write} text={t('addElement')} />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_element}
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
                // {
                //   label: 'FileType',
                //   onChange: e => setFileType(Number(e.target.value)),
                //   value: fileType,
                //   type: 'select',
                //   options: fileTypes?.data?.map(el => ({
                //     value: el.id,
                //     label: el.title
                //   }))
                // }
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
          path='pbf-data-elements'
        />
      )}
    </Grid>
  )
}

Element.acl = [PERMISSIONS.element.read]
export default Element
