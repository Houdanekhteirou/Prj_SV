'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import Icon from 'src/@core/components/icon'
import { fetchPermissionRequests } from 'src/api/config/config'
import { col_permission_request } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import { PERMISSIONS } from 'src/constants'

function PermissionRequests() {
  const { t } = useTranslation()

  const [user, setUser] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['PermissionRequests'],
    queryFn: async () => {
      const res = await fetchPermissionRequests({
        user: user
      })
      const newData = res?.data.map(el => ({
        ...el,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr')
      }))

      return { count: res?.count, data: newData }
    }
  })

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Demandes de permissions exceptionnelles')} total={data?.count} />
          <CardContent>
            <DynamicTable
              columns={col_permission_request}
              data={data?.data || []}
              isLoading={isLoading}
              primaryKey='id'
              actions={[
                { name: 'Edit', icon: 'mdi:pencil-outline', handler: id => console.log('Edit', id), color: 'primary' },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => console.log(id),
                  color: 'red',
                  confirmation: true
                },
                {
                  name: 'View',
                  icon: 'mdi:eye-outline',
                  handler: id => console.log('View', id),
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

PermissionRequests.acl = [PERMISSIONS.permissionRequest.read]
export default PermissionRequests
