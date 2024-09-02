import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { sign } from 'crypto'
import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import FactureExportl from 'src/@core/components/exports/facture'
import FallbackSpinner from 'src/@core/components/spinner'
import { getMonthName } from 'src/@core/utils'
import { fetchPbfReport, signPbfReport } from 'src/api/reports'
import { fetchPbfReportType } from 'src/api/reports/types'
import { reportsTypesEnum } from 'src/constants'
import { useAuth } from 'src/hooks/useAuth'
import { PrestataireReport, AsReport, MgReport, WlReport, BqReport } from 'src/views/apps/reports'

const ReportMapper = {
  [reportsTypesEnum.CONSOLIDE_MENSUELLE_PRESTATAIRES]: PrestataireReport,
  [reportsTypesEnum.CONSOLIDE_MENSUELLE_AS]: AsReport,
  [reportsTypesEnum.CONSOLIDE_MENSUELLE_MOUGHATAA]: MgReport,
  [reportsTypesEnum.CONSOLIDE_MENSUELLE_WILAYA]: WlReport,
  [reportsTypesEnum.BONUS_QUALITE]: BqReport
}

const Generator = () => {
  const router = useRouter()
  const { i18n, t } = useTranslation() // Use useI18n for translations
  const locale = i18n.language
  const compRef = useRef(null)
  const { user } = useAuth()

  let { id } = router.query

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => fetchPbfReport(+id),
    enabled: !!id
  })

  const { data: reportTypeData, isLoading: isLoadingReportTypes } = useQuery({
    queryKey: ['reports', 'pbf-report-types'],
    queryFn: () => fetchPbfReportType(data?.reporttypeId),
    enabled: !!data
  })

  const reportData = useMemo(() => {
    if (!data) return {}

    const name = data?.entity ? `${data?.zone} / ${data?.entity}` : data?.zone
    const createdAt = new Date(data.createdAt).toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    let signatories = []

    if (data.signatories2 == null) {
      signatories = reportTypeData?.signatories?.map(signatory => {
        return {
          code: signatory.code,
          userId: null,
          img: null
        }
      })
    } else {
      signatories = data.signatories2
    }

    console.log('signatories', signatories)

    return {
      ...data,
      data: JSON.parse(data.data_str),
      month: getMonthName(data.month, locale),
      name,
      createdAt,
      signatories
    }
  }, [data, locale, reportTypeData])

  const handleSign = async code => {
    const data = reportData.signatories.map(signatory => {
      return {
        code: signatory.code,
        userId: signatory.code === code ? user?.id : signatory.userId
      }
    })

    try {
      await signPbfReport(+id, {
        id: +id,
        signatories: JSON.stringify(data)
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading || !data || isLoadingReportTypes || !reportTypeData) return <FallbackSpinner />

  const FactureComponent = ReportMapper[reportData?.uid]
  console.log('reportData', reportData)

  const getSignatory = (code, signatories) => {
    return signatories?.find(signatory => signatory.code === code)
  }

  return (
    <main className='mt-16 w-full'>
      <FactureExportl tableRef={compRef} />
      <div className='p-10  bg-white mt-3' tabIndex={-1} ref={compRef}>
        <div className=''>
          <div className='flex flex-col items-center gap-2'>
            <h3 className='font-bold text-lg'>{t('République Islamique de Mauritanie')}</h3>
            <p className='text-base'>{t('Honneur-fraternité-justice')}</p>
            <img src='/images/logo_rim.svg' alt='logo' width={100} height={100} />
            <p className='mt-1 font-semibold text-base'>{t('Ministère de la santé')}</p>
            <p className='mt-1 font-semibold text-base'>{t('Unité Nationale FBR')}</p>
            <p className='mt-1 font-semibold text-base'>
              {reportData.reporttype} {reportData.month} {reportData.year}
            </p>
          </div>
        </div>

        <div className='flex justify-between w-full gap-3 mt-6 print:mt-0'>
          <p className='bold text-black'>{reportData?.name}</p>
          <p>
            {t('facture_generated_at')} <span className='font-bold'>{reportData?.createdAt}</span>
          </p>
        </div>

        <FactureComponent reportData={reportData} />

        <div className='flex justify-between px-10 py-5'>
          {reportTypeData?.signatories?.map((signatory, index) => (
            <div key={index}>
              <p className='bold text-black'>{signatory.name}</p>
              {signatory?.roleId &&
                (getSignatory(signatory.code, reportData.signatories)?.userId ? (
                  <img
                    src={getSignatory(signatory.code, reportData.signatories)?.img}
                    alt='signature'
                    width={100}
                    height={100}
                  />
                ) : (
                  <Button variant='text' color='primary' id='sign_buttons' onClick={() => handleSign(signatory.code)}>
                    Signer
                  </Button>
                ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Generator
