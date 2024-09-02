'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { deletePlanification, fetchPlanification } from 'src/api/planifications/planification'
import { col_planification } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import { PERMISSIONS } from 'src/constants'
import { useMemo, useState } from 'react'
import AddButton from 'src/layouts/components/acl/AddButton'
import { getZonesOptions } from 'src/@core/utils'
import SectionTitle from 'src/@core/components/SectionTItle'
import { fetchZonesByUser } from 'src/api/organizations/zones'

function Planifications() {
  const { t } = useTranslation()
  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const [zoneId, setZoneId] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['planifications', zoneId, pagination],
    queryFn: () =>
      fetchPlanification({
        ...pagination,
        zoneId: zoneId
      })
  })
  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })

  const { wilayas, moughataas, zoneSanitaires }: any = useMemo(() => {
    return getZonesOptions(wilaya, moughataa, zonesByUser)
  }, [wilaya, moughataa, zonesByUser])

  const handleDeleteRow = async id => {
    if (!window.confirm('forms_delete_confirmation')) return
    const res = await deletePlanification(id)
    if (res) toast.success(t('delete_success'))
    else toast.error('Row deletion failed')
    queryClient.invalidateQueries({ queryKey: ['planifications'] })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('Planifications')}
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.entity.write}
                text={t('Add Planification')}
              />
            }
          />
          <CardContent>
            {/* <div className='flex justify-between items-center '>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id='wilayaa-select'>{t('Wilaya')}</InputLabel>
                  <Select
                    fullWidth
                    value={wilaya}
                    id='select-wilayaa'
                    label='Select Wilayaa'
                    labelId='wilayaa-select'
                    onChange={e => {
                      setWilaya(e.target.value)
                      setZoneId(e.target.value)
                    }}
                    inputProps={{ placeholder: 'Select Wilayaa' }}
                  >
                    {wilayas?.map(wilaya => (
                      <MenuItem key={wilaya.value} value={wilaya.value}>
                        {t(wilaya.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id='moughataa-select'>{t('Moughataa')}</InputLabel>
                  <Select
                    fullWidth
                    value={moughataa}
                    id='select-moughataa'
                    label='Select Moughataa'
                    labelId='moughataa-select'
                    onChange={e => {
                      setMoughataa(e.target.value)
                      setZoneId(e.target.value)
                    }}
                    inputProps={{ placeholder: 'Select Moughataa' }}
                  >
                    {moughataas?.map(moughataa => (
                      <MenuItem key={moughataa.value} value={moughataa.value}>
                        {t(moughataa.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id='zone-select'>{t('Zone Sanitaire')}</InputLabel>
                  <Select
                    fullWidth
                    value={zoneSanitaire}
                    id='select-zone'
                    label='Select Zone'
                    labelId='zone-select'
                    onChange={e => {
                      setZoneSanitaire(e.target.value)
                      setZoneId(e.target.value)
                    }}
                    inputProps={{ placeholder: 'Select Zone' }}
                  >
                    {zoneSanitaires?.map(zoneSanitaire => (
                      <MenuItem key={zoneSanitaire.value} value={zoneSanitaire.value}>
                        {t(zoneSanitaire.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

            </div> */}
            <DynamicTable
              columns={col_planification}
              data={data?.data || []}
              isLoading={isLoading}
              primaryKey='id'
              filterFields={[
                {
                  label: 'Wilaya',
                  onChange: e => {
                    setWilaya(e.target.value)
                    setMoughataa(null)
                    setZoneSanitaire(null)
                    setZoneId(e.target.value)
                  },
                  value: wilaya,
                  type: 'select',
                  options: wilayas
                },
                {
                  label: 'Moughataa',
                  onChange: e => {
                    setMoughataa(Number(e.target.value))
                    setZoneSanitaire(null)
                    setZoneId(Number(e.target.value))
                  },
                  value: moughataa,
                  type: 'select',
                  options: moughataas
                },
                {
                  label: 'Zone Sanitaire',
                  onChange: e => {
                    setZoneSanitaire(Number(e.target.value))
                    setZoneId(Number(e.target.value))
                  },
                  value: zoneSanitaire,
                  type: 'select',
                  options: zoneSanitaires
                }
              ]}
              actions={[
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.entity.delete]
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

Planifications.acl = [PERMISSIONS.entity.read]

export default Planifications
