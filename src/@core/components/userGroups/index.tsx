import { Icon } from '@iconify/react'
import { Card, CardHeader, Collapse, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchGroupMembers } from 'src/api/access-management/groups/members'
import { deleteGroupMember } from 'src/api/access-management/groups/members'
import { col_group_members_lite } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import IconifyIcon from '../icon'
// import { FormUserGroups } from './Form'

export const UserGroups = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['groupMembers', userId],
    queryFn: async () => {
      const res = await fetchGroupMembers({
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

  const handleDelteGroup = async group => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteGroupMember(group.id)
    if (res) {
      refetch()
    }
  }

  const handleAddGroup = () => {
    router.push(`/admin/access-management/group-members/form/?mode=create&userId=${userId}`)
  }

  return (
    <Card>
      <CardHeader
        title={t(`Les Groupes de l'utilisateur`)}
        action={
          <div>
            <IconButton size='small' aria-label='add' onClick={handleAddGroup}>
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
          columns={col_group_members_lite}
          data={data || []}
          isLoading={isFetching}
          primaryKey='id'
          actions={[
            {
              name: 'Delete',
              icon: 'mdi:delete-outline',
              handler: id => handleDelteGroup(id),
              color: 'red',
              confirmation: true
            },
            {
              name: 'Edit',
              icon: 'mdi:pencil-outline',
              handler: id => router.push(`/admin/access-management/group-members/form?mode=edit&id=${id}`),
              color: 'primary'
            }
          ]}
        />
      </Collapse>

      {/* <FormUserGroups isOpen={isOpen} onClose={() => setIsOpen(false)} userId={userId} refetch={refetch} /> */}
    </Card>
  )
}
