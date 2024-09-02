import React, { useState } from 'react'
import { ContractModal } from './ContractModal'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { useTranslation } from 'react-i18next'
import DynamicTable from '../../../views/components/tabs/DynamicTable'
import { col_contract, col_contact, col_bank_account } from 'src/constants'
import { ContactModal } from './ContactModal'

const EntitiesFormExtra = ({ contracts, isLoading, id, contacts, entityAcounts }) => {
  const { t } = useTranslation() // Use useI18n for translations
  const [collapsedContract, setCollapsedContract] = useState<boolean>(false)
  const [collapsedContact, setCollapsedContact] = useState<boolean>(false)
  const [contractModalOpen, setContractModalOpen] = React.useState(false)
  const [contactModalOpen, setContactModalOpen] = React.useState(false)
  const [compteModalOpen, setCompteModalOpen] = React.useState(false)
  const [collapsedCompte, setCollapsedCompte] = useState<boolean>(false)

  return (
    <div className='flex flex-col gap-2'>
      <Card>
        <CardHeader
          title={t(`Les Contacts de cette Entité`)}
          action={
            <IconButton size='small' aria-label='collapse' sx={{ color: 'text.secondary' }}>
              <Icon fontSize={20} icon={!collapsedContract ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
            </IconButton>
          }
          onClick={() => setCollapsedContract(!collapsedContract)}
        />
        <Collapse in={collapsedContract}>
          <CardContent>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='sm:flex sm:items-center'>
                <div className='sm:flex-auto'></div>
                <div className='mt-4 sm:ml-16 sm:mt-0 flex gap-1'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      setContractModalOpen(true)
                    }}
                  >
                    <Icon icon='mdi:plus' fontSize={20} />
                  </Button>
                </div>
              </div>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    <DynamicTable
                      columns={col_contract}
                      data={contracts || []}
                      isLoading={isLoading}
                      primaryKey='id'
                      actions={[
                        {
                          name: 'Delete',
                          icon: 'mdi:delete-outline',
                          handler: id => (id: number) => {
                            // openDeleteModal(id);
                          },
                          color: 'red',
                          confirmation: true
                        }
                      ]}
                    />
                  </div>
                  <ContractModal isOpen={contractModalOpen} onClose={() => setContractModalOpen(false)} entityId={id} />{' '}
                </div>
              </div>
            </div>
          </CardContent>
        </Collapse>
      </Card>
      <Card>
        <CardHeader
          title={t(`Les Contrats de cette Entité`)}
          action={
            <IconButton size='small' aria-label='collapse' sx={{ color: 'text.secondary' }}>
              <Icon fontSize={20} icon={!collapsedContact ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
            </IconButton>
          }
          onClick={() => setCollapsedContact(!collapsedContact)}
        />
        <Collapse in={collapsedContact}>
          <CardContent>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='sm:flex sm:items-center'>
                <div className='sm:flex-auto'></div>
                <div className='mt-4 sm:ml-16 sm:mt-0 flex gap-1'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      setContactModalOpen(true)
                    }}
                  >
                    <Icon icon='mdi:plus' fontSize={20} />
                  </Button>
                </div>
              </div>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    <DynamicTable
                      columns={col_contact}
                      data={contacts || []}
                      isLoading={isLoading}
                      primaryKey='id'
                      actions={[
                        {
                          name: 'Delete',
                          icon: 'mdi:delete-outline',
                          handler: id => (id: number) => {
                            // openDeleteModal(id);
                          },
                          color: 'red',
                          confirmation: true
                        }
                      ]}
                    />
                  </div>
                  <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} entityId={id} />{' '}
                </div>
              </div>
            </div>
          </CardContent>
        </Collapse>
      </Card>
      <Card>
        <CardHeader
          title={t(`Les Comptes de cette Entité`)}
          action={
            <IconButton size='small' aria-label='collapse' sx={{ color: 'text.secondary' }}>
              <Icon fontSize={20} icon={!collapsedCompte ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
            </IconButton>
          }
          onClick={() => setCollapsedCompte(!collapsedCompte)}
        />
        <Collapse in={collapsedCompte}>
          <CardContent>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='sm:flex sm:items-center'>
                <div className='sm:flex-auto'></div>
                <div className='mt-4 sm:ml-16 sm:mt-0 flex gap-1'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      setCompteModalOpen(true)
                    }}
                  >
                    <Icon icon='mdi:plus' fontSize={20} />
                  </Button>
                </div>
              </div>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    <DynamicTable
                      columns={col_bank_account}
                      data={entityAcounts || []}
                      isLoading={isLoading}
                      primaryKey='id'
                      actions={[
                        {
                          name: 'Delete',
                          icon: 'mdi:delete-outline',
                          handler: id => (id: number) => {
                            // openDeleteModal(id);
                          },
                          color: 'red',
                          confirmation: true
                        }
                      ]}
                    />
                  </div>
                  <ContactModal isOpen={compteModalOpen} onClose={() => setCompteModalOpen(false)} entityId={id} />{' '}
                </div>
              </div>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  )
}

export default EntitiesFormExtra
