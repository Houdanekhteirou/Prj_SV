// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Next Imports

import { useQuery } from '@tanstack/react-query'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { useSearchParams } from 'next/navigation'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Table Components Imports
import { Box, Button } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import SectionTitle from 'src/@core/components/SectionTItle'
import { depsToOptions, getZonesOptions, hasPermission, mapMonthsToTrimesters, years } from 'src/@core/utils'
import axiosInstance from 'src/api/axiosInstance'
import { deleteFile, fetchFiles } from 'src/api/data/file'
import { fetchFileTypesByEntityType } from 'src/api/data/filetype'
import { fetchOneFrequency } from 'src/api/data/frequency'
import { fetchEntitiesFilter } from 'src/api/entities'
import { fetchEntityClasses } from 'src/api/entities/entityclasse'
import { col_file, PERMISSIONS } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

import { useAuth } from 'src/hooks/useAuth'

const DataList = () => {
  const auth = useAuth()
  const { authorities } = auth.user
  const router = useRouter()
  const pathname = usePathname()
  const routerQuery = router.query
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })
  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const [entity, setEntity] = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [zoneId, setZoneId] = useState<string | null>(null)
  const [entityClass, setEntityClass] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (routerQuery.entityClass) {
      setEntityClass(routerQuery.entityClass as string)
    }
  }, [routerQuery])

  const { data: entityClasses } = useQuery({
    queryKey: ['entityClasses'],
    queryFn: () => fetchEntityClasses({})
  })

  const {
    data: files,
    refetch,
    isLoading
  } = useQuery({
    queryKey: [
      'files',
      pagination,
      entityClass,
      zoneId,
      entity,
      fileType,
      month,
      year,
      wilaya,
      moughataa,
      zoneSanitaire
    ],
    queryFn: async () => {
      const res = await fetchFiles({
        ...pagination,
        fileType: fileType ? +fileType : null,
        entityClassId: entityClass ? +entityClass : null,
        entiyId: entity ? +entity : null,
        year: year ? +year : null,
        month: month ? +month : null,
        zoneId: zoneId
      })

      const newData = res?.data.map(el => ({
        ...el,
        entity: (
          <div className='flex gap-2'>
            {el.entity}
            {el?.source && el?.source === 'MOBILE' && <Icon icon='mdi:cellphone' fontSize={13} />}
          </div>
        ),
        createdAt: new Date(el.createdAt).toLocaleDateString('fr'),
        updatedAt: el.updatedAt ? new Date(el.updatedAt).toLocaleDateString('fr') : '--',
        status: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={el.status} color='primary' />
          </Box>
        )
      }))

      return { count: res?.count, data: newData }
    }
  })
  const handleEntityClassChange = (e: SelectChangeEvent) => {
    setWilaya(null)
    setMoughataa(null)
    setZoneSanitaire(null)
    setEntity(null)
    setFileType(null)
    setMonth(null)
    setYear(null)
    setPagination({ pageNumber: 0, pageSize: 10 })
    setEntityClass(e.target.value)
  }
  const searchParams = useSearchParams()

  const { user } = useAuth()
  const zonesByUser = user?.zones

  const { wilayas, moughataas, zoneSanitaires }: any = useMemo(() => {
    const { wilaya, moughataa } = router.query

    return getZonesOptions(wilaya, moughataa, zonesByUser)
  }, [router.query, zonesByUser])

  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () =>
      zoneSanitaire
        ? fetchEntitiesFilter({
            'zoneId.equals': zoneSanitaire,
            'entityclassId.equals': entityClass
          })
        : null,

    enabled: !!zoneSanitaire
  })
  const { data: filetypes } = useQuery({
    queryKey: ['filetypes', router.query],
    queryFn: () => {
      const { entity } = router.query
      if (!entity) return

      return fetchFileTypesByEntityType({
        entityTypeId: entities?.find(el => el.id == entity)?.entitytypid
      })
    },
    enabled: !!router.query?.entity
  })
  const { data: frequency } = useQuery({
    queryKey: ['frequency', fileType],
    queryFn: () => {
      if (!fileType) return
      const id = filetypes?.data.find(el => el.id == fileType)?.frequencyId

      return fetchOneFrequency(id as number)
    },
    enabled: !!fileType
  })
  const monthOptions = useMemo(() => {
    if (!frequency) return []
    const periods = JSON.parse(frequency?.months)
    const trims = mapMonthsToTrimesters(periods)

    return trims
  }, [frequency])

  const yearOptions = useMemo(() => {
    return years.map(year => ({
      value: year,
      label: year
    }))
  }, [])

  const handleValidation = useCallback(async (id: number, isValid: boolean) => {
    const res = await axiosInstance.patch(
      `/api/validate/pbf-data-files/${id}`,
      {},

      {
        params: {
          isValid: isValid
        }
      }
    )

    if (res.status.toString().startsWith('2')) {
      toast.success(isValid ? 'File invalidated Sucessfully' : 'File validated Sucessfully')
    }
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce fichier ?')) return
    try {
      const res = await deleteFile(id)
      if (res) {
        toast.success('File deleted Sucessfully')
      }
    } catch (err) {
      toast.error('Error while deleting file')
    }
    refetch()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('data entry')}
            total={files?.count}
            addButton={
              <Button
                variant='contained'
                onClick={() =>
                  router.push(
                    `/admin/data/data-entry/create?entityClass=${entityClass}&wilaya=${wilaya}&moughataa=${moughataa}&zoneSanitaire=${zoneSanitaire}&entity=${entity}&fileType=${fileType}&month=${month}&year=${year}`
                  )
                }
                disabled={!hasPermission(authorities, PERMISSIONS.file.write)}
              >
                <Icon icon='mdi:plus' fontSize={20} />
                {t('nouveauFichier')}
              </Button>
            }
          />

          {/* <Button
              variant='contained'
              color='primary'
              onClick={() =>
                router.push(
                  `/admin/data/data-entry/create?entityClass=${entityClass}&wilaya=${wilaya}&moughataa=${moughataa}&zoneSanitaire=${zoneSanitaire}&entity=${entity}&fileType=${fileType}&month=${month}&year=${year}`
                )
              }
              style={{ display: !hasPermission(authorities, PERMISSIONS.file.write) ? 'none' : 'block' }}
            >
              {t('nouveauFichier')}
              {''}
              <Icon icon='mdi:file' fontSize={20} />
            </Button> */}
          <Divider color='primary' />
          <CardContent>
            <FormControl fullWidth>
              <InputLabel id='entityClass-select'>{t('entityClasse')}</InputLabel>
              <Select
                fullWidth
                value={entityClass}
                id='select-entityClass'
                label='Select EntityClass'
                labelId='entityClass-select'
                onChange={handleEntityClassChange}
                inputProps={{ placeholder: 'Select EntityClass' }}
              >
                <MenuItem value=''>
                  <em>{t('all')}</em>
                </MenuItem>
                {entityClasses?.data.map(entityClass => (
                  <MenuItem key={entityClass.id} value={entityClass.id}>
                    {entityClass.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>

          <Divider />
          <DynamicTable
            columns={col_file}
            filterFields={[
              {
                label: 'wilaya',
                onChange: e => setWilaya(e.target.value),
                value: wilaya,
                type: 'select',
                options: [{ value: null, label: t('all') }, ...wilayas],
                name: 'wilaya'
              },
              {
                label: 'moughataa',
                onChange: e => setMoughataa(e.target.value),
                value: moughataa,
                type: 'select',
                options: [{ value: null, label: t('all') }, ...moughataas],
                name: 'moughataa'
              },
              {
                label: 'zoneSanitaire',
                onChange: e => setZoneSanitaire(e.target.value),
                value: zoneSanitaire,
                type: 'select',
                options: [{ value: null, label: t('all') }, ...(zoneSanitaires || [])],
                name: 'zoneSanitaire'
              },
              {
                label: 'entity',
                onChange: e => setEntity(e.target.value),
                value: entity,
                type: 'select',
                options: [{ value: null, label: t('all') }, ...depsToOptions(entities || [])],
                name: 'entity'
              },
              {
                label: 'fileType',
                onChange: e => setFileType(e.target.value),
                value: fileType,
                type: 'select',
                options: [
                  { value: null, label: t('all') },
                  ...(filetypes?.data.map(el => ({
                    value: el.id,
                    label: el.title
                  })) || [])
                ],
                name: 'fileType'
              },
              {
                label: 'month',
                onChange: e => setMonth(e.target.value),
                value: month,
                type: 'select',
                options: [{ value: null, label: t('all') }, ...monthOptions],
                name: 'month'
              },
              {
                label: 'year',
                onChange: e => setYear(e.target.value),
                value: year,
                type: 'select',
                options: [{ value: null, label: t('all') }, ...yearOptions],
                name: 'year'
              }
            ]}
            data={files?.data || []}
            isLoading={isLoading}
            primaryKey='id'
            specialActions={[
              (row: any) =>
                row.hide === false ? (
                  <Button
                    variant='text'
                    size='small'
                    sx={{ mr: 2 }}
                    color={!row.isrollback ? 'primary' : 'error'}
                    onClick={() => handleValidation(row.id, row.isrollback)}
                  >
                    <Box component='span' sx={{ color: !row.isrollback ? 'primary' : 'error', mr: 2 }}>
                      <Icon icon={!row.isrollback ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'} />
                    </Box>
                    {!row.isrollback ? t('validate') : t('rollback')}
                  </Button>
                ) : null
            ]}
            actions={[
              {
                name: 'Edit',
                icon: 'mdi:pencil-outline',
                handler: id => router.push(`/admin/data/data-entry/edit/${id}?entityClass=${entityClass}`),
                color: 'primary',
                requiredPermissions: [PERMISSIONS.file.update]
              },
              {
                name: 'Delete',
                icon: 'mdi:delete-outline',
                handler: id => handleDelete(id),
                color: 'red',
                confirmation: true,
                requiredPermissions: [PERMISSIONS.file.delete]
              },
              {
                name: 'View',
                icon: 'mdi:eye-outline',
                handler: id => router.push(`/admin/data/data-entry/view/${id}?entityClass=${entityClass}`),
                color: 'green'
              },
              {
                name: 'History',
                icon: 'mdi:history',
                handler: id => router.push(`/admin/data/data-entry/history/${id}`),
                color: 'blue'
              }
            ]}
            refetchPagination={(page, rowsPerPage) => {
              setPagination({ pageNumber: page, pageSize: rowsPerPage })
              refetch()
            }}
            count={files?.count}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

DataList.acl = [PERMISSIONS.file.read]

export default DataList
