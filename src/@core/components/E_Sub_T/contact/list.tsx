import { Button, Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { col_contact } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import Icon from 'src/@core/components/icon'
import { deleteContact, fetchContacts, updateContact, updateEntityContact } from 'src/api/entities/contact'
import { ContactForm } from './modal'
import { toast } from 'react-hot-toast'

const EnityContactsList = ({ id }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [ModalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['entityContacts'],
    queryFn: () => fetchContacts({ id: id })
  })

  const del = async (id: number) => {
    if (!confirm(t('Are you sure you want to delete this item?'))) return
    const res = await deleteContact(id)

    if (res) {
      toast.success(t('deleted successfully'))
      refetch()
    } else {
      toast.error(t('Error'))
    }
  }

  const setAsFavorite = async (id: number) => {
    const res = await updateEntityContact(id, { activated: 1 })
    if (res) {
      toast.success(t('updated successfully'))
      refetch()
    } else {
      toast.error(t('Error'))
    }
  }

  return (
    <Card>
      <CardHeader
        title={t(`Les contacts`)}
        action={
          <IconButton size='small' aria-label='collapse' sx={{ color: 'text.secondary' }}>
            <Icon fontSize={20} icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
          </IconButton>
        }
        onClick={() => setCollapsed(!collapsed)}
      />
      <Collapse in={collapsed}>
        <CardContent>
          <div className='px-4 sm:px-6 lg:px-8'>
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
                    columns={col_contact}
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
                    specialActions={[
                      (row: any) => (
                        <Button color='primary' onClick={() => setAsFavorite(row.id)}>
                          <Icon
                            icon={row.activated ? 'tabler:star-filled' : 'tabler:star'}
                            color={row.activated ? 'yellow' : 'gray'}
                            fontSize={20}
                          />
                        </Button>
                      )
                    ]}
                  />
                </div>
              </div>
              {/* {id && (
                <ContactForm isOpen={ModalOpen} onClose={() => setModalOpen(false)} entityId={id} refetch={refetch} />
              )} */}
            </div>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default EnityContactsList
