import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import FallbackSpinner from 'src/@core/components/spinner'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import { fetchPbfReportTypes } from 'src/api/reports/types'
import { TreportType } from 'src/configs/traslationFields'
import { col_report_type, PERMISSIONS } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

const ReportsManagement = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reports', 'pbf-report-types'],
    queryFn: fetchPbfReportTypes
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)

  const router = useRouter()
  const { pathname } = router

  const handleModalTranslation = id => {
    const translations = data?.find(el => el.id === id)?.translations
    setModalData({
      fields: TreportType,
      translations: translations,
      elementId: id
    })
    setModalOpen(true)
  }

  if (isLoading) return <FallbackSpinner />

  return (
    <div>
      <DynamicTable
        columns={col_report_type}
        data={data || []}
        isLoading={isLoading}
        primaryKey='id'
        actions={[
          {
            name: 'Edit',
            icon: 'mdi:pencil-outline',
            handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
            color: 'primary',
            requiredPermissions: [PERMISSIONS.zone.update]
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
      />
      {modalData && (
        <TranslationComponentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          translations={modalData?.translations}
          fields={modalData?.fields}
          elementId={modalData?.elementId}
          path='pbf-report-types'
        />
      )}
    </div>
  )
}

export default ReportsManagement
