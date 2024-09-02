import { useTranslation } from 'react-i18next'

export function MgReport({ reportData }: any) {
  const { t } = useTranslation()

  const columns: any = [
    { id: 'name', name: t('AIRES DE SANTE') },
    { id: 'name', name: t('ENTITIES') },
    { id: 'bank', name: t('BANQUE') },
    { id: 'accountNumber', name: t('N° COMPTE') },
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
          {reportData.data?.values?.map(item => {
            const entities = item.values.map((entry, entryIndex) => (
              <tr key={entry.id}>
                {entryIndex === 0 && (
                  <td className='border border-slate-700 text-base text-center text-black' rowSpan={item.values.length}>
                    {item.name}
                  </td>
                )}
                {columns.slice(1).map(el => (
                  <td key={el.id} className='border border-slate-700 text-base text-center text-black'>
                    {entry[el.id]}
                  </td>
                ))}
              </tr>
            ))

            return (
              <>
                {entities}
                <tr className='font-bold bg-white'>
                  <td className=' border-black border-2 text-base text-center h-6' colSpan={4}>
                    {t('Sous-total Aire de Santé')}
                  </td>
                  <td className='border-black border-2 text-base text-center'>{item.qtty}</td>
                  <td className='border-black border-2 text-base text-center'>{item.qlty}</td>
                  <td className='border-black border-2 text-base text-center'>{item.total}</td>
                </tr>
              </>
            )
          })}
          <tr className='font-bold bg-white'>
            <td className='border-black border-2 text-base text-center px-4' colSpan={4}>
              {t('total_to_pay_for_moughataa')}
            </td>

            <td className='border-black border-2 text-base text-center px-4'>{reportData.data.qtty}</td>
            <td className='border-black border-2 text-base text-center px-4'>{reportData.data.qlty}</td>
            <td className='border-black border-2 text-base text-center px-4'>{reportData.data.total}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
