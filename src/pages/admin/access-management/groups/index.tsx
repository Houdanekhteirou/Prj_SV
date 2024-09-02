import { Card, CardContent, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import FallbackSpinner from 'src/@core/components/spinner'
import { deleteGroupe, fetchGroupes } from 'src/api/access-management/groups'
import { col_group } from 'src/constants'
import { PERMISSIONS } from 'src/constants'
import { TGroup } from 'src/configs/traslationFields'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

const Groups = () => {
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const router = useRouter()

  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['groups', pagination],
    queryFn: async () => {
      const res = await fetchGroupes({
        ...pagination
      })

      return res
    }
  })

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteGroupe(id)
    if (res.success) {
      toast.success(t('forms_delete_success'))
      refetch()
    } else toast.error(t('forms_delete_error'))
  }

  const handleModalTranslation = id => {
    const translations = data?.data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TGroup,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  if (isLoading) {
    return <FallbackSpinner />
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={'groups'}
            total={data?.count}
            addButton={
              <AddButton pathname={pathname} requiredPermissions={PERMISSIONS.element.write} text={t('Add Group')} />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_group}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
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
                  name: 'group-assignments',
                  icon: 'mdi:eye-outline',
                  handler: id => router.push(`${pathname}/group-assignments?id=${id}`),
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
          path='pbf-user-groups'
        />
      )}
    </Grid>
  )
}

export default Groups
