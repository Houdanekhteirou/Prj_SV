import { Icon } from '@iconify/react'
import { Card, CardHeader, Collapse, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteRoleMember, fetchRoleMembers } from 'src/api/access-management/rols/members'
import { col_rol_members_lite } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import IconifyIcon from '../icon'

export const UserRoles = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['roleMembers--j', userId],
    queryFn: async () => {
      const res = await fetchRoleMembers({
        userId: userId
      })
      const newData = res?.data.map(el => {
        return {
          ...el,
          startedAt: el.startedAt ? new Date(el.startedAt).toLocaleDateString() : '',
          closedAt: el.closedAt ? new Date(el.closedAt).toLocaleDateString() : ''
        }
      })

      return newData
    },
    enabled: !!userId
  })

  const { t } = useTranslation()

  const handleDelteRole = async role => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteRoleMember(role.id)
    if (res) {
      refetch()
    }
  }

  const handleAddRole = () => {
    router.push(`/admin/access-management/role-members/form/?mode=create&userId=${userId}`)
  }

  return (
    <Card>
      <CardHeader
        title={t(`Les Roles de l'utilisateur`)}
        action={
          <div>
            <IconButton size='small' aria-label='add' onClick={handleAddRole}>
              <IconifyIcon icon='mdi:plus' fontSize={20} />
            </IconButton>
            <IconButton
              size='small'
              aria-label='collapse'
              sx={{ color: 'text.secondary' }}
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon fontSize={20} icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
            </IconButton>
          </div>
        }
      />
      <Collapse in={collapsed}>
        <DynamicTable
          columns={col_rol_members_lite}
          data={data || []}
          isLoading={isFetching}
          primaryKey='id'
          actions={[
            {
              name: 'Delete',
              icon: 'mdi:delete-outline',
              handler: id => handleDelteRole(id),
              color: 'red',
              confirmation: true
            },
            {
              name: 'Edit',
              icon: 'mdi:pencil-outline',
              handler: id => router.push(`/admin/access-management/role-members/form/?mode=edit&id=${id}`),
              color: 'primary'
            }
          ]}
        />
      </Collapse>

      {/* <FormUserRoles isOpen={isOpen} onClose={() => setIsOpen(false)} userId={userId} refetch={refetch} /> */}
    </Card>
  )
}
