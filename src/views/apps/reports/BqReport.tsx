import { useTranslation } from 'react-i18next'

export function BqReport({ reportData }: any) {
  const { t } = useTranslation()

  return (
    <>
      <table className='min-w-full mt-10 divide-y divide-gray-300 border-collapse border-slate-600'>
        {reportData.data.value &&
          Object.keys(reportData.data.value).map((key, index) => (
            <tr key={index}>
              <td className='whitespace-normal px-2 py-2 text-left text-base text-black truncate border border-slate-700 '>
                {t(key)}
              </td>
              <td className='whitespace-normal px-2 py-2 text-left text-base text-black truncate border border-slate-700 '>
                {reportData.data.value[key]}
              </td>
            </tr>
          ))}
      </table>
    </>
  )
}
