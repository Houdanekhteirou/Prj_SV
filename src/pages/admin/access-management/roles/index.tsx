// ** React Imports
'use client'
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// ** Icon Imports
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import FallbackSpinner from 'src/@core/components/spinner'
import { deleteRole, fetchRoles } from 'src/api/access-management/rols'
import { col_role } from 'src/constants'
import { PERMISSIONS } from 'src/constants'
import { TRole } from 'src/configs/traslationFields'
import DynamicTable from 'src/views/components/tabs/DynamicTable'
import RoleForm from './roleForm'
import { Button } from '@mui/material'
import AddButton from 'src/layouts/components/acl/AddButton'

const RolesCards = () => {
  // ** States
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [open, setOpen] = useState<boolean>(false)
  const [selecedRole, setSelectedRole] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)

  const {
    data: cardData,
    isLoading,

    isFetching,
    refetch
  } = useQuery({
    queryKey: ['groups', pagination],
    queryFn: async () => {
      const res = await fetchRoles({
        ...pagination
      })

      return res
    }
  })

  const { t } = useTranslation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedRole(null)
    setOpen(false)
    refetch()
  }
  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return
    const res = await deleteRole(id)
    if (res.success) {
      toast.success(t('forms_delete_success'))
      refetch()
    } else toast.error(t('forms_delete_error'))
  }

  const handleModifyRow = id => {
    const selectedRole = cardData?.find(item => item.id === id)
    if (selectedRole) {
      setSelectedRole(selectedRole)
      handleClickOpen()
    }
  }

  const handleModalTranslation = id => {
    const translations = cardData?.data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TRole,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  if (isLoading) {
    return <FallbackSpinner />
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <SectionTitle
              title={'Roles'}
              total={cardData?.count}
              addButton={<AddButton requiredPermissions={[PERMISSIONS.element.write]} text={'Add Role'} />}
            />
            <CardContent>
              <DynamicTable
                columns={col_role}
                data={cardData || []}
                isLoading={isLoading || isFetching}
                primaryKey='id'
                actions={[
                  {
                    name: 'Edit',
                    icon: 'mdi:pencil-outline',
                    handler: id => handleModifyRow(id),
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
                  },
                  {
                    name: 'Translate',
                    icon: 'mdi:translate',
                    handler: id => handleModalTranslation(id),
                    color: 'blue'
                  }
                ]}
                refetchPagination={(page, rowsPerPage) => {
                  setPagination({ pageNumber: page, pageSize: rowsPerPage })
                }}
                count={cardData?.count || 0}
              />
            </CardContent>
            {selecedRole && <RoleForm handleClose={handleClose} role={selecedRole} open={open} />}
          </Card>
        </Grid>
        {modalData && (
          <TranslationComponentModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            translations={modalData?.translations}
            fields={modalData?.fields}
            elementId={modalData?.elementId}
            path='pbf-user-role'
          />
        )}
      </Grid>
    </>
  )
}

export default RolesCards
