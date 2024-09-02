'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { deletePost, fetchPosts } from 'src/api/posts/posts'
import { PERMISSIONS, posts_options } from 'src/configs/constant'
import { TPosts } from 'src/configs/traslationFields'
import { col_post } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

function News() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [name, setName] = useState('')
  const [option, setOption] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['Docs', pagination, name, option],
    queryFn: async () => {
      const res = await fetchPosts({
        ...pagination,
        title: name,
        option: option ? option : null
      })
      const newData = res?.data.map(el => ({
        ...el,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr'),
        updatedAt: new Date(el.updatedAt).toLocaleDateString('fr'),
        published: el.published ? (
          <Icon icon='lets-icons:check-ring-duotone' color='green' fontSize={'2rem'} />
        ) : (
          <Icon icon='lets-icons:check-ring-duotone' color='red' fontSize={'2rem'} />
        ),
        archived: el.archived ? (
          <Icon icon='lets-icons:check-ring-duotone' color='green' fontSize={'2rem'} />
        ) : (
          <Icon icon='lets-icons:check-ring-duotone' color='red' fontSize={'2rem'} />
        )
      }))

      return { count: res?.count, data: newData }
    }
  })

  const handleModalTranslation = id => {
    const translations = data?.data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TPosts,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deletePost(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['Docs'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('posts')}
            total={data?.count}
            addButton={
              <AddButton pathname={pathname} requiredPermissions={PERMISSIONS.cms.read} text={t('Add Post')} />
            }
          />
          <CardContent>
            <Box
              sx={{
                p: 5,
                pb: 3,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            ></Box>
            <DynamicTable
              columns={col_post}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'Name',
                  onChange: e => setName(e.target.value),
                  value: name,
                  type: 'text',
                  name: 'name'
                },
                {
                  label: 'Option',
                  onChange: e => setOption(e.target.value),
                  value: option,
                  type: 'select',
                  options: [{ value: null, label: t('all') }, ...posts_options],
                  name: 'option'
                }
              ]}
              actions={[
                {
                  name: 'Edit',
                  icon: 'mdi:pencil-outline',
                  handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  color: 'primary'
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true
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
          path='pbf-content-posts'
        />
      )}
    </Grid>
  )
}

News.acl = [PERMISSIONS.cms.read]

export default News
