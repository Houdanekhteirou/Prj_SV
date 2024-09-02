import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { FileTypeModal } from './FileTypeModal'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { deleteFileTypeFromElement, fetchAllFileTypeFrequency, fetchElements } from 'src/api/data/element'
import { fetchFileTypes } from 'src/api/data/filetype'
import { CsubEl, CsubEl1 } from 'src/constants'
import DynamicTable from '../../../views/components/tabs/DynamicTable'

const TableE = ({ id, isFileType = false }) => {
  const { t } = useTranslation() // Use useI18n for translations
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const { data: allFileTypes, isLoading: isFileTypesLoading } = useQuery({
    queryKey: ['filetypes', id],
    queryFn: () => fetchFileTypes({ all: true }),
    enabled: !isFileType
  })

  const { data: allIndicators, isLoading: isIndicatorsLoading } = useQuery({
    queryKey: ['indicators', id],
    queryFn: async () => {
      const data = await fetchElements({ all: true })
      return data?.data
    },
    enabled: isFileType
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['filetypes frequencies', id],
    queryFn: async () => {
      const data = await fetchAllFileTypeFrequency(id, isFileType)

      const newData = data?.map(el => ({
        ...el,
        openingDate: el.openingDate.substring(0, 10),
        closedDate: el.closedDate.substring(0, 10)
      }))

      return newData
    }
  })

  const handleOpenCreateModal = () => {
    setMode('create')
    setModalOpen(true)
  }

  const handleOpenEditModal = id => {
    setMode('edit')
    setEditingItemId(id)
    setModalOpen(true)
  }
  const deleteFrequency = async id => {
    if (id && confirm(t('Are you sure you want to delete this item?'))) {
      await deleteFileTypeFromElement(id)
      refetch()
    }
  }

  return (
    <Card>
      <CardHeader
        title={t(`evalueation_grid`)}
        action={
          <>
            <IconButton
              size='small'
              aria-label='collapse'
              sx={{ color: 'text.secondary' }}
              onClick={handleOpenCreateModal}
              type='button'
            >
              <Icon icon='mdi:plus' fontSize={30} />
            </IconButton>

            <IconButton
              size='small'
              aria-label='collapse'
              sx={{ color: 'text.secondary' }}
              onClick={() => setCollapsed(!collapsed)}
              type='button'
            >
              <Icon fontSize={40} icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
            </IconButton>
          </>
        }
      />
      <Collapse in={collapsed}>
        <CardContent>
          {/* <SectionTitle
            title={t('Les indicateurs')}
            total={data?.length}
            addButton={

            }
          /> */}
          <DynamicTable
            columns={isFileType ? CsubEl1 : CsubEl}
            data={data?.length ? data : []}
            isLoading={isLoading || isFileTypesLoading}
            primaryKey='id'
            actions={[
              { name: 'Edit', icon: 'mdi:pencil-outline', handler: handleOpenEditModal, color: 'primary' },
              {
                name: 'Delete',
                icon: 'mdi:delete-outline',
                handler: id => deleteFrequency(id),
                color: 'red',
                confirmation: true
              }
            ]}
            columnOrder='orderNumber'
          />
        </CardContent>
      </Collapse>
      {modalOpen && (
        <FileTypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          elementId={id}
          id={editingItemId}
          fileTypes={
            allFileTypes ? allFileTypes?.data?.map(fileType => ({ label: fileType.title, value: fileType.id })) : []
          }
          title={
            data?.length
              ? !isFileType
                ? data?.find(item => item.id === editingItemId)?.filetype_name
                : data?.find(item => item.id === editingItemId)?.element_name
              : ''
          }
          allIndicators={
            allIndicators
              ? allIndicators?.object?.map(indicator => ({ label: indicator.title, value: indicator.id }))
              : []
          }
          isFileType={isFileType}
          refetch={refetch}
          mode={mode}
        />
      )}
    </Card>
  )
}

export default TableE
