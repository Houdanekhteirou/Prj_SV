'use client'
import { Card, CardContent, Grid } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { deletePopulation, fetchPopulations } from 'src/api/populations/population'
import { col_population } from 'src/constants'
import { PERMISSIONS } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import AddButton from 'src/layouts/components/acl/AddButton'

function DataPopulation() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })
  const [name, setName] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['populations', pagination, name],
    queryFn: () =>
      fetchPopulations({
        ...pagination,
        name: name || undefined
      })
  })

  const handleDeleteRow = async id => {
    // Delete row
    if (!confirm(t('forms_delete_confirmation'))) return
    const res = await deletePopulation(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    refetch()
    queryClient.invalidateQueries({ queryKey: ['Populations'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('Target populations')}
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.population.read}
                text={t('Add Target Population')}
                onClick={() => router.push(`${pathname}/form?mode=create`)}
              />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_population}
              data={data?.data || []}
              isLoading={isLoading}
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
                  requiredPermissions: [PERMISSIONS.population.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.population.delete]
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
                refetch()
              }}
              count={data?.count || 0}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

DataPopulation.acl = [PERMISSIONS.population.read]

export default DataPopulation
