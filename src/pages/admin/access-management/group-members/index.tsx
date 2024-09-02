import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchGroupes } from 'src/api/access-management/groups'
import { deleteGroupMember, fetchGroupMembers } from 'src/api/access-management/groups/members'
import { col_group_members } from 'src/constants'
import { PERMISSIONS } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import SectionTitle from 'src/@core/components/SectionTItle'

const GroupMembers = () => {
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 15 })
  const pathname = usePathname()
  const [groupe, setGroupe] = useState(null)
  const router = useRouter()

  const { t } = useTranslation()
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['groupMembers', pagination, groupe],
    queryFn: async () => {
      const res = await fetchGroupMembers({
        ...pagination,
        groupId: groupe
      })
      const new_res = res?.data.map(el => {
        return {
          ...el,
          status: el.allowed ? (
            <Icon icon='lets-icons:check-ring-duotone' color='green' fontSize={'2rem'} />
          ) : (
            <Icon icon='lets-icons:check-ring-duotone' color='red' fontSize={'2rem'} />
          ),
          startedAt: new Date(el?.startedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          closedAt: new Date(el?.closedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        }
      })

      return { data: new_res, count: res?.count }
    }
  })

  const { data: groupes, isLoading: isGroupesLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await fetchGroupes({
        all: true,
        pageNumber: 0,
        pageSize: null
      })

      return res.data
    }
  })

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteGroupMember(id)
    if (res.success) {
      toast.success(t('forms_delete_success'))
      refetch()
    } else toast.error(t('forms_delete_error'))
  }

  if (isLoading) {
    return <FallbackSpinner />
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title={t('group_members')}
            total={data?.count}
            addButton={
              <AddButton
                pathname={pathname}
                requiredPermissions={PERMISSIONS.element.write}
                text={'Add Group Member'}
              />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_group_members}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'group',
                  onChange: e => setGroupe(Number(e.target.value)),
                  value: groupe,
                  type: 'select',
                  options: groupes?.map(group => ({
                    label: group.name,
                    value: group.id
                  }))
                }
              ]}
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

export default GroupMembers
