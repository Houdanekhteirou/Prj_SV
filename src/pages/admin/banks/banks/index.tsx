'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, CardHeader, Collapse, Grid, IconButton, Menu, MenuItem } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import Icon from 'src/@core/components/icon'
import { deleteBank, fetchBanks } from 'src/api/banks/bank'
import { TentityClass } from 'src/configs/traslationFields'

import { Box } from '@mui/system'
import { col_bank_child } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import { PERMISSIONS } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'

import SectionTitle from 'src/@core/components/SectionTItle'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

function Bankes() {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [title, setTitle] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const res = await fetchBanks({
        // ...pagination,
        // title: title
        all: true,
        list: true
      })
      const newData = res?.data.map(el => ({
        ...el,
        createdAt: new Date(el.createdAt).toLocaleDateString('fr')
      }))

      return { count: res?.count, data: newData }
    }
  })
  const [collapsed, setCollapsed] = useState<boolean[]>(new Array(data?.data?.length).fill(false))

  const handleModalTranslation = id => {
    const translations = data?.data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TentityClass,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteBank(id)
    if (res) toast.success(fileOperations.delete.successMessage)
    else toast.error(fileOperations.delete.errorMessage)
    queryClient.invalidateQueries({ queryKey: ['banks'] })
  }
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <SectionTitle
              title={t('Banks')}
              total={data?.count}
              addButton={
                <AddButton pathname={pathname}  text={t('Add Bank')} /> // requiredPermissions={PERMISSIONS.bank.write}
              }
            />
            <CardContent>
              {data?.data?.map((bank, index) => (
                <div className='flex flex-col gap-10' key={bank.id}>
                  <Card style={{ marginBottom: '20px' }}>
                    <CardHeader
                      title={t(bank.name)}
                      action={
                        <>
                          <IconButton size='small' onClick={handleClick}>
                            <Icon icon='mdi:dots-vertical' />
                          </IconButton>
                          <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right'
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right'
                            }}
                            PaperProps={{ style: { minWidth: '8rem' } }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <MenuItem className='align-middle'>
                              <Button
                                variant='text'
                                size='small'
                                sx={{ color: 'primary', mr: 2 }}
                                onClick={() => {
                                  router.push(`${pathname}/form?mode=edit&id=${bank.id}`)
                                  handleClose()
                                }}
                              >
                                <Box component='span' sx={{ color: 'primary', mr: 2 }}>
                                  <Icon icon={'mdi:pencil-outline'} />
                                </Box>
                                {t('Edit')}
                              </Button>
                            </MenuItem>
                            <MenuItem className='align-middle'>
                              <Button
                                variant='text'
                                size='small'
                                sx={{ color: 'red', mr: 2 }}
                                onClick={() => {
                                  handleDeleteRow(bank.id)
                                  handleClose()
                                }}
                              >
                                <Box component='span' sx={{ color: 'red', mr: 2 }}>
                                  <Icon icon={'mdi:delete-outline'} />
                                </Box>
                                {t('Delete')}
                              </Button>
                            </MenuItem>
                            <MenuItem className='align-middle'>
                              <Button
                                variant='text'
                                size='small'
                                sx={{ color: 'primary', mr: 2 }}
                                onClick={() => {
                                  handleModalTranslation(bank.id)
                                  handleClose()
                                }}
                              >
                                <Box component='span' sx={{ color: 'primary', mr: 2 }}>
                                  <Icon icon={'mdi:translate'} />
                                </Box>
                                {t('Translate')}
                              </Button>
                            </MenuItem>
                          </Menu>

                          <IconButton
                            aria-label='collapse'
                            sx={{ color: 'text.secondary' }}
                            onClick={() => {
                              const newCollapsed = [...collapsed]
                              newCollapsed[index] = !newCollapsed[index]
                              setCollapsed(newCollapsed)
                            }}
                          >
                            <Icon fontSize={20} icon={!collapsed[index] ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
                          </IconButton>
                        </>
                      }
                    />
                    <Collapse in={collapsed[index]}>
                      <CardContent>
                        <div className='px-4 sm:px-6 lg:px-8'>
                          <div className='sm:flex sm:items-center'>
                            <div className='sm:flex-auto'></div>
                            <div className='mt-4 sm:ml-16 sm:mt-0 flex gap-1'></div>
                          </div>
                          <div className='mt-8 flow-root'>
                            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                                <DynamicTable
                                  columns={col_bank_child}
                                  data={bank?.children || []}
                                  isLoading={isLoading}
                                  primaryKey='id'
                                  actions={[
                                    {
                                      name: 'Edit',
                                      icon: 'mdi:pencil-outline',
                                      handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                                      color: 'primary',
                                      requiredPermissions: [PERMISSIONS.bank.update]
                                    },
                                    {
                                      name: 'Delete',
                                      icon: 'mdi:delete-outline',
                                      handler: id => console.log(id),
                                      color: 'red',
                                      confirmation: true,
                                      requiredPermissions: [PERMISSIONS.bank.delete]
                                    },
                                    {
                                      name: 'Translate',
                                      icon: 'mdi:translate',
                                      handler: id => handleModalTranslation(id),
                                      color: 'blue'
                                    }
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Collapse>
                  </Card>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
        {modalData && (
          <TranslationComponentModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            translations={modalData?.translations}
            fields={modalData?.fields}
            elementId={modalData?.elementId}
            path='pbf-finance-banks'
          />
        )}
      </Grid>
    </>
  )
}

// Bankes.acl = [PERMISSIONS.bank.read]

export default Bankes
