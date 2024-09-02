'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { deleteBudget, fetchBudgets } from 'src/api/budgets/budget'
import { col_budget } from 'src/constants'
import { TentityClass } from 'src/configs/traslationFields'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import { formatNumberWithSpaces } from 'src/@core/utils'
import { PERMISSIONS } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'

import SectionTitle from 'src/@core/components/SectionTItle'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

function Budgets() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [title, setTitle] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const res = await fetchBudgets({
        ...pagination,
        title: title
      })
      const newData = res?.data.map(el => ({
        ...el,
        amount: formatNumberWithSpaces(el.amount),
        entityType: el.entitytypesDTO?.name,
        entity: el.entitiesDTO?.name,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr'),
        region: el.zonesDTO?.name
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
    const res = await deleteBudget(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['budgets'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('Budgets')}
            total={data?.count}
            addButton={
              <AddButton pathname={pathname} requiredPermissions={PERMISSIONS.budget.write} text={t('add Budget')} />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_budget}
              data={data?.data || []}
              isLoading={isLoading}
              primaryKey='id'
              filterFields={[
                {
                  label: 'Title',
                  onChange: e => setTitle(e.target.value),
                  value: title,
                  type: 'text'
                }
              ]}
              actions={
                [
                  // {
                  //   name: 'Edit',
                  //   icon: 'mdi:pencil-outline',
                  //   handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  //   color: 'primary'
                  // },
                  // {
                  //   name: 'Delete',
                  //   icon: 'mdi:delete-outline',
                  //   handler: id => handleDeleteRow(id),
                  //   color: 'red',
                  //   confirmation: true
                  // },
                  // {
                  //   name: 'Translate',
                  //   icon: 'mdi:translate',
                  //   handler: id => handleModalTranslation(id),
                  //   color: 'blue'
                  // },
                  // {
                  //   name: 'View',
                  //   icon: 'mdi:eye-outline',
                  //   handler: id => router.push(`${pathname}/form?mode=view&id=${id}`),
                  //   color: 'green'
                  // }
                ]
              }
              refetchPagination={(page, rowsPerPage) => {
                setPagination({ pageNumber: page, pageSize: rowsPerPage })
                refetch()
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
          path='pbf-finance-budgets'
        />
      )}
    </Grid>
  )
}

Budgets.acl = [PERMISSIONS.budget.read]
export default Budgets
