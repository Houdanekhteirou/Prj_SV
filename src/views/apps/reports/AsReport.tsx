import { useTranslation } from 'react-i18next'

export function AsReport({ reportData }: any) {
  const { t } = useTranslation()

  const columns: any = [
    { id: 'name', name: t('entity') },
    { id: 'bank', name: t('bank') },
    { id: 'accountNumber', name: t('accountNumber') },
    { id: 'qtty', name: t('amount_qtty') },
    { id: 'qlty', name: t('amount_qlty') },
    { id: 'total', name: t('amount_total') }
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
                {t(el.name)}
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
                      className='whitespace-normal px-2 py-2 text-left text-base text-gray-500 truncate border border-slate-700 '
                    >
                      {item[el.id]}
                    </td>
                  ))}
                </tr>
              )
            })}
          <tr>
            <td className='px-3 py-4 border border-slate-700 text-base font-semibold text-left' colSpan={3}>
              {t("TOTAL A PAYER A L'AIRE DE SANTE")}
            </td>

            <td className='px-3 py-4 border border-slate-700  text-base font-semibold text-left'>
              {reportData.data.qtty}
            </td>
            <td className='px-3 py-4 border border-slate-700 text-base font-semibold text-left'>
              {reportData.data.qlty}
            </td>
            <td className='px-3 py-4 border border-slate-700 text-base font-semibold text-left'>
              {reportData.data.total}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
