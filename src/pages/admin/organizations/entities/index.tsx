'use client'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import { getZonesOptions } from 'src/@core/utils'
import { deleteEntity, fetchEntities } from 'src/api/entities'
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { TentityClass } from 'src/configs/traslationFields'
import { PERMISSIONS, col_entity } from 'src/constants'
import AddButton from 'src/layouts/components/acl/AddButton'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

function Entities() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const [name, setName] = useState('')

  const router = useRouter()

  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })
  const pathname = usePathname()

  const { wilayas, moughataas, zoneSanitaires }: any = useMemo(() => {
    return getZonesOptions(wilaya, moughataa, zonesByUser)
  }, [wilaya, moughataa, zonesByUser])

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['entities', pagination, name, zoneSanitaire, wilaya, moughataa],
    queryFn: () =>
      fetchEntities({
        ...pagination,
        name: name,
        zoneId: zoneSanitaire ? zoneSanitaire : moughataa ? moughataa : wilaya ? wilaya : null
      })
  })

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
    const res = await deleteEntity(id)
    if (res) {
      toast.success(fileOperations.delete.successMessage)
    } else toast.error(fileOperations.delete.errorMessage)
    refetch()
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <SectionTitle
            title='Entities'
            total={data?.count}
            addButton={
              <div className='flex'>
                <>
                  <AddButton
                    pathname={pathname}
                    requiredPermissions={PERMISSIONS.entity.write}
                    text={t('Add Entity')}
                  />{' '}
                  <Button>
                    <a href='/admin/organizations/entities/planification' className='underline'>
                      {t('Entity Planification')}
                    </a>
                  </Button>
                </>
              </div>
            }
          />
          <CardContent>
            <DynamicTable
              columns={col_entity}
              data={data?.data || []}
              isLoading={isLoading || isFetching}
              primaryKey='id'
              filterFields={[
                {
                  label: 'Name',
                  onChange: e => setName(e.target.value),
                  value: name,
                  type: 'text',
                  name: 'name'
                },
                {
                  label: 'Wilaya',
                  onChange: e => setWilaya(e.target.value),
                  value: wilaya,
                  type: 'select',
                  options: wilayas,
                  name: 'wilaya'
                },
                {
                  label: 'Moughataa',
                  onChange: e => setMoughataa(e.target.value),
                  value: moughataa,
                  type: 'select',
                  options: moughataas,
                  name: 'moughataa'
                },
                {
                  label: 'Zone Sanitaire',
                  onChange: e => setZoneSanitaire(e.target.value),
                  value: zoneSanitaire,
                  type: 'select',
                  options: zoneSanitaires,
                  name: 'zoneSanitaire'
                }
              ]}
              actions={[
                {
                  name: 'Edit',
                  icon: 'mdi:pencil-outline',
                  handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                  color: 'primary',
                  requiredPermissions: [PERMISSIONS.entity.update]
                },
                {
                  name: 'Delete',
                  icon: 'mdi:delete-outline',
                  handler: id => handleDeleteRow(id),
                  color: 'red',
                  confirmation: true,
                  requiredPermissions: [PERMISSIONS.entity.delete]
                },
                {
                  name: 'Translate',
                  icon: 'mdi:translate',
                  handler: id => handleModalTranslation(id),
                  color: 'blue'
                },
                {
                  name: 'View',
                  icon: 'mdi:eye-outline',
                  handler: id => router.push(`${pathname}/form?mode=view&id=${id}`),
                  color: 'green'
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
      {modalData && (
        <TranslationComponentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          translations={modalData?.translations}
          fields={modalData?.fields}
          elementId={modalData?.elementId}
          path='pbf-organization-entities'
        />
      )}
    </Grid>
  )
}

Entities.acl = [PERMISSIONS.entity.read]
export default Entities
