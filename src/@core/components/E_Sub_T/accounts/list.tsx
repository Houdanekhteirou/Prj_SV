import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material'
import { toast } from 'react-hot-toast'

import { fetchEntityAccounts, deleteEntityAccount, updateEntityAccount } from 'src/api/banks/bank'
import { col_bank_account } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import Icon from 'src/@core/components/icon'
import { AccountForm } from './modal'

const checkActiveAndDisableIt = async data => {
  const promises = data.map(async item => {
    if (item.active) {
      await updateEntityAccount(item.id, { active: false })
    }
  })
  await Promise.all(promises)
}

const BankAccountsList = ({ id }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [modalCreateOpen, setModalCreateOpen] = useState(false)
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const { t } = useTranslation()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['entityAccounts'],
    queryFn: () => fetchEntityAccounts({ entityId: id })
  })

  const handleDelete = async accountId => {
    if (!confirm(t('Are you sure you want to delete this item?'))) return
    const res = await deleteEntityAccount(accountId)

    if (res) {
      toast.success(t('Deleted successfully'))
      refetch()
    } else {
      toast.error(t('Error'))
    }
  }

  const handleEdit = rowId => {
    const selectedRow = data?.find(item => item.id === rowId)
    setSelected(selectedRow)
    setModalEditOpen(true)
  }

  const handleSetAsFavorite = async (accountId, isActive) => {
    await checkActiveAndDisableIt(data)
    const res = await updateEntityAccount(accountId, { active: !isActive })
    if (res) {
      toast.success(t('Updated successfully'))
      refetch()
    } else {
      toast.error(t('Error'))
    }
  }

  return (
    <Card>
      <CardHeader
        title={t('Les comptes bancaires')}
        action={
          <IconButton
            size='small'
            aria-label='collapse'
            sx={{ color: 'text.secondary' }}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon fontSize={20} icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
          </IconButton>
        }
      />
      <Collapse in={collapsed}>
        <CardContent>
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'></div>
            <div className='mt-4 sm:ml-16 sm:mt-0 flex gap-1'>
              {/* <Button variant='contained' color='primary' onClick={() => setModalCreateOpen(true)}>
                {t('Ajouter un compte bancaire')}
                <Icon icon='mdi:plus' fontSize={20} />
              </Button> */}
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <DynamicTable
              columns={col_bank_account}
              data={data || []}
              isLoading={isLoading}
              primaryKey='id'
              actions={[
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: handleDelete,
                  color: 'red',
                  confirmation: true
                },
                {
                  name: 'Edit',
                  icon: 'mdi:pencil',
                  handler: handleEdit,
                  color: 'blue'
                }
              ]}
              columnOrder='active'
              columnOrderDirection='desc'
              specialActions={[
                row => (
                  <Button color='primary' onClick={() => handleSetAsFavorite(row.id, row.active)}>
                    <Icon
                      icon={row.active ? 'tabler:star-filled' : 'tabler:star'}
                      color={row.active ? 'yellow' : 'gray'}
                      fontSize={20}
                    />
                  </Button>
                )
              ]}
            />
          </div>
          <AccountForm
            isOpen={modalCreateOpen}
            onClose={() => setModalCreateOpen(false)}
            entityId={id}
            refetch={refetch}
            mode={'create'}
            setSelected={setSelected}
            isThereAnyAccount={data?.length > 0}
          />
          {/* {selected && (
            <AccountForm
              isOpen={modalEditOpen}
              onClose={() => setModalEditOpen(false)}
              entityId={id}
              refetch={refetch}
              mode={'edit'}
              selected={selected}
              setSelected={setSelected}
            />
          )} */}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default BankAccountsList
