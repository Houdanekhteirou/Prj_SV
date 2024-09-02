import { useTranslation } from 'react-i18next'
import { formatNumberWithSpaces, mapMonthsToTrimesters } from 'src/@core/utils'
import { convertNumberToWords } from 'src/@core/utils/num-to-world'

export function PrestataireReport({ reportData }: any) {
  const { t } = useTranslation()
  const date = new Date()

  const currentDate = `${date.getDate()} ${t(
    mapMonthsToTrimesters([date.getMonth() + 1])[0].label
  )} ${date.getFullYear()}`

  const columns: any = [
    { id: 'ordernumber', name: 'N°' },
    { id: 'indicator', name: t('Indicateur') },
    { id: 'qde', name: t('Qtté déclarée') },
    { id: 'qve', name: t('Qtté vérifiée') },
    { id: 'qva', name: t('Qtté validée') },
    { id: 'ecart', name: t('Écart %') },
    { id: 'tarif', name: t('Tarif unitaire') },
    { id: 'amount', name: t('Montant en (MRU)') }
  ]

  return (
    <>
      <table className='min-w-full mt-10 divide-y divide-gray-300 border-collapse border-slate-600'>
        <thead>
          <tr>
            {columns.map(el => (
              <th
                key={el.id}
                scope='col'
                className='px-3 py-3.5  text-left text-base font-semibold text-gray-900 border border-slate-700'
              >
                {el.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {reportData.data?.values
            ?.sort((a, b) => a.ordernumber - b.ordernumber)
            ?.map(item => {
              return (
                <tr key={item.id}>
                  {columns.map(el => (
                    <td
                      key={el.id}
                      className=' whitespace-normal px-3 py-4 text-base text-gray-500 truncate border border-slate-700 '
                    >
                      {item[el.id]}
                    </td>
                  ))}
                </tr>
              )
            })}
          <tr className='font-bold bg-white'>
            <td className='border-black border-2 text-base text-left px-2 h-6' colSpan={7}>
              {t('Total à payer pour le mois')}
            </td>
            <td className='border-black border-2 text-base text-center'>
              {formatNumberWithSpaces(reportData?.total)} MRU
            </td>
          </tr>
        </tbody>
      </table>

      <div className='mt-4'>
        <p className='text-sm text-justify'>
          {t('Arrêté la présente facture pour le mois de')}{' '}
          <span className='font-bold'>
            {reportData?.month} - {reportData?.year}
          </span>{' '}
          {t('pour la formation sanitaire')} <span className='font-bold'>{reportData?.entity} </span>
          {t('à un montant de')}{' '}
          <span className='font-bold text-black'>
            {reportData?.total ? (convertNumberToWords(reportData?.total) as any) : 0}{' '}
          </span>
          {t('MRU à verser sur le compte numéro:')}{' '}
          <span className='font-bold text-black'>{reportData?.bankAccount}</span> {t('ouvert à')}{' '}
          <span className='font-bold text-black'>{reportData?.bank}</span>
        </p>
      </div>
    </>
  )
}
