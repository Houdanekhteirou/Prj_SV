// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Next Imports

import { useQuery } from '@tanstack/react-query'

import { fetchAllProjects } from 'src/api/Projet/Projet'

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
import { col_project, PERMISSIONS, schema_project } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

const Projects = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  if (typeof window !== 'undefined') {
    // Code that requires the window object
    console.log(window.innerWidth)
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetchAllProjects()
      const newData = res?.data.map(el => ({
        ...el,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr')
      }))

      return { data: newData }
    }
  })
  const [collapsed, setCollapsed] = useState<boolean[]>(new Array(data?.data?.length).fill(false))

  function handleDelete(id: string): void {
    throw new Error('Function not implemented.')
  }

  return (
    <Card>
      <CardContent>
        <SectionTitle title={t('Projets')} />
        <DynamicTable
          data={data?.data}
          columns={col_project}
          isLoading={isLoading}
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
              handler: id => router.push(`/admin/data/data-entry/view/${id}?entityClass=${1}`),
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
          primaryKey={''}
        />
      </CardContent>
    </Card>
  )
}

// DataList.acl = [PERMISSIONS.file.read]

export default Projects
