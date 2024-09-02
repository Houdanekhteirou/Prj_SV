import { Card, CardContent, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import SectionTitle from 'src/@core/components/SectionTItle'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchRoles } from 'src/api/access-management/rols'
import { deleteRoleMember, fetchRoleMembers } from 'src/api/access-management/rols/members'
import { col_rol_members, PERMISSIONS } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

const GroupMembers = () => {
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 15 })
  const pathname = usePathname()
  const [role, setRole] = useState(null)
  const router = useRouter()

  const { t } = useTranslation()
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['groupMembers', pagination, role],
    queryFn: async () => {
      const res = await fetchRoleMembers({
        ...pagination,
        roleId: role || null
      })
      const new_res = res?.data.map(el => {
        return {
          ...el,
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

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await fetchRoles({
        all: true,
        pageNumber: 0,
        pageSize: null
      })

      return res
    }
  })

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteRoleMember(id)
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
            title={t('role-members')}
            total={data?.count}
            addButton={
              <AddButton pathname={pathname} requiredPermissions={PERMISSIONS.element.write} text={'Add Role Member'} />
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_rol_members}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'role',
                  onChange: e => setRole(Number(e.target.value)),
                  value: role,
                  type: 'select',
                  options: roles?.map(group => ({
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
