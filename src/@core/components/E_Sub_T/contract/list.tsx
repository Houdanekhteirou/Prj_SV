import { Button, Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { col_contract } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import Icon from 'src/@core/components/icon'
import { fetchContractsByEntityId, updateContract } from 'src/api/entities/contract'
import { ContratForm } from './modal'
import { deleteContract } from 'src/api/entities/contract'
import { toast } from 'react-hot-toast'

const checkActiveAndDisableIt = async data => {
  const promises = data.map(async item => {
    if (item.active) {
      await updateContract(item.id, { active: false })
    }
  })
  await Promise.all(promises)
}
const ContractsList = ({ id }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [ModalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['entity--Contracts'],
    queryFn: () => fetchContractsByEntityId({ id: id })
  })

  const del = async (id: number) => {
    if (!confirm(t('Are you sure you want to delete this item?'))) return
    const res = await deleteContract(id)

    if (res) {
      toast.success(t('deleted successfully'))
      refetch()
    } else {
      toast.error(t('Error'))
    }
  }

  console.log('data--------', data)

  const handleSetAsFavorite = async (accountId, isActive) => {
    await checkActiveAndDisableIt(data)
    const res = await updateContract(accountId, { active: !isActive })
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
        title={t(`Les contrats`)}
        action={
          <IconButton size='small' aria-label='collapse' sx={{ color: 'text.secondary' }}>
            <Icon fontSize={20} icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
          </IconButton>
        }
        onClick={() => setCollapsed(!collapsed)}
      />
      <Collapse in={collapsed}>
        <CardContent>
          <div className=''>
            <div className='sm:flex sm:items-center'>
              <div className='sm:flex-auto'></div>
              <div className='mt-4 sm:ml-16 sm:mt-0 flex gap-1'>
                {/* <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setModalOpen(true)
                  }}
                >
                  <Icon icon='mdi:plus' fontSize={20} />
                </Button> */}
              </div>
            </div>
            <div className='mt-8 flow-root'>
              <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                  <DynamicTable
                    columns={col_contract}
                    data={data || []}
                    isLoading={isLoading}
                    primaryKey='id'
                    actions={[
                      {
                        name: 'Delete',
                        icon: 'mdi:delete-outline',
                        handler: del,
                        color: 'red',
                        confirmation: true
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
                {/* <ContratForm isOpen={ModalOpen} onClose={() => setModalOpen(false)} entityId={id} refetch={refetch} />{' '} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default ContractsList
