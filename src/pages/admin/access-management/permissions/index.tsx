'use client'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

import { fetchPermissions } from 'src/api/access-management/permissions'
import { col_permission } from 'src/constants'

function Premissions() {
  const { t } = useTranslation()

  const router = useRouter()
  const pathname = usePathname()

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetchPermissions({})
  })

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Autorisations')} />
          <CardContent>
            <DynamicTable
              columns={col_permission}
              data={data || []}
              isLoading={isLoading}
              primaryKey='id'
              actions={[
                {
                  name: 'View',
                  icon: 'mdi:eye-outline',
                  handler: id => router.push(`${pathname}/form?mode=view&id=${id}`),
                  color: 'green'
                }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Premissions
