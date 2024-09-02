import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import { Card, CardContent, CardHeader, MenuItem, Select, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { col_report, PERMISSIONS } from 'src/constants'
import FormFacture from 'src/views/components/reports/forms/form2'

import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchPbfReports } from 'src/api/reports'
import { fetchPbfReportTypes } from 'src/api/reports/types'
import { reportsTypesEnum } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

const Faqs = () => {
  const [activeTab, setActiveTab] = useState(reportsTypesEnum.CONSOLIDE_MENSUELLE_PRESTATAIRES)
  const { t } = useTranslation()
  const router = useRouter()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const { pathname } = router

  const methods = useForm({})

  const a = methods.watch()
  console.log('fasdf', a)

  const { data: reportTypes, isLoading: isLoadingReportTypes } = useQuery({
    queryKey: ['reports', 'pbf-report-types'],
    queryFn: () => fetchPbfReportTypes()
  })

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', activeTab, reportTypes],
    queryFn: async () => {
      const res = await fetchPbfReports({
        ...pagination,
        params: {
          'reporttypeId.equals': reportTypes?.find(type => type.uid === activeTab)?.id
        }
      })

      return {
        count: res.count,
        data: res.data.map(report => ({
          ...report,
          date: getReportDate(report.month, report.year),
          name: report.entity ? report.entity : report.zone
        }))
      }
    },
    enabled: !!activeTab && !!reportTypes
  })

  const options = useMemo(() => {
    if (!reportTypes || isLoadingReportTypes) return []

    return reportTypes.map(type => ({
      value: type.uid,
      label: type.name,
      requiredPermission: type.permission,
      content: <FormFacture type={type.uid} />
    }))
  }, [reportTypes, isLoadingReportTypes])

  const handleChange = event => {
    setActiveTab(event.target.value)
  }

  const getReportDate = (month, year) => {
    const isQuarterly = month % 3 === 0

    if (isQuarterly) {
      return `${year}Q${month / 3}`
    }

    return `${month}/${year}`
  }

  if (isLoading) return <FallbackSpinner />

  return (
    <Card>
      <CardHeader
        className='text-center'
        variant='h2'
        title={<Typography variant='h4'>{t('Gestion-des-rapports')}</Typography>}
      />
      <TabContext value={activeTab}>
        <Box
          sx={{
            width: '100%',
            p: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Select value={activeTab} onChange={handleChange} fullWidth>
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.label)}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <FormProvider {...methods}>
          {options.map(option => (
            <TabPanel key={option.value} value={option.value}>
              {option.content}
            </TabPanel>
          ))}
        </FormProvider>
      </TabContext>
      <CardContent>
        <DynamicTable
          columns={col_report}
          data={reports?.data || []}
          isLoading={isLoading}
          primaryKey='id'
          actions={[
            {
              name: 'View',
              icon: 'mdi:eye-outline',
              handler: id => router.push(`${pathname}/generate?id=${id}`),
              color: 'green'
            }
          ]}
          refetchPagination={(page, rowsPerPage) => {
            setPagination({ pageNumber: page, pageSize: rowsPerPage })
          }}
          count={reports?.count || 0}
        />
      </CardContent>
    </Card>
  )
}

Faqs.acl = [
  PERMISSIONS.report.factureMensuelleEcd,
  PERMISSIONS.report.factureMensuelleFosa,
  PERMISSIONS.report.factureMensuelleMutuelles,
  PERMISSIONS.report.factureTrimestrielleEcd,
  PERMISSIONS.report.factureTrimestrielleFosa,
  PERMISSIONS.report.invoiceDet,
  PERMISSIONS.report.invoices,
  PERMISSIONS.report.monthlyPaymentOrder,
  PERMISSIONS.report.monthlyPaymentRequest,
  PERMISSIONS.report.quarterlyConsolidated,
  PERMISSIONS.report.quarterlyPaymentOrder,
  PERMISSIONS.report.rapportBm
]

export default Faqs
