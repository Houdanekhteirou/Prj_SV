'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Grid } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import { deleteAccounts, fetchAccounts2 } from 'src/api/banks/account'
import { col_account, PERMISSIONS } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

function Account() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })
  const [number, setNumber] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['accounts', pagination, number],
    queryFn: async () => {
      const res = await fetchAccounts2({
        ...pagination,
        number: number
      })

      return { data: res?.data, count: res?.count }
    }
  })
  console.log('data', data)

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteAccounts(id)
    refetch()
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title='bankAccounts'
            total={data?.count}
            // addButton={
            //   <AddButton
            //     pathname={pathname}
            //     requiredPermissions={PERMISSIONS.entityClass.write}
            //     text={t('Add Account')}
            //   />
            // }
          />
          <CardContent>
            <DynamicTable
              columns={col_account}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'number',
                  onChange: e => setNumber(e.target.value),
                  value: number,
                  type: 'text'
                }
              ]}
              actions={[
                {
                  name: 'Edit',
                  icon: 'mdi:pencil-outline',
                  handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  color: 'primary',
                  requiredPermissions: [PERMISSIONS.entityClass.update]
                },
                {
                  name: 'View',
                  icon: 'mdi:eye-outline',
                  handler: id => router.push(`${pathname}/form?mode=view&id=${id}`),
                  color: 'green'
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  requiredPermissions: [PERMISSIONS.entityClass.delete]
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
export default Account
