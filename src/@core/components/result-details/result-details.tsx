'use client'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import PopulationChart from '../chart/PopulationGraph'
import Skeleton from '@mui/material/Skeleton'
import Table from 'src/@core/utilities/table/table'
import ExportData from 'src/@core/utilities/export/ExportData'

interface dataType {
  name: string
  values: number[]
}
const ResultList = ({
  rows = [],
  elementName,
  isLoading,
  columns,
  dataToExport
}: {
  rows?: dataType[]
  elementName: string
  isLoading: boolean
  columns: string[]
  dataToExport: any
}) => {
  const totalPeople =
    columns.length > 0
      ? [...new Array(columns.length - 1)].map((_, index) =>
          rows.reduce((accumulator, currentValue) => accumulator + currentValue.values[index], 0)
        )
      : []
  const componentRef = useRef()

  const route = usePathname()

  const parentIds = dataToExport.map(element => element.id)

  return (
    <>
      <h1 className='font-serif text-3xl border-b border-b-primary-500 text-primary-500 pb-3 pt-3 mb-12'>
        {elementName}
      </h1>

      <div className='w-full relative mb-10' style={{ overflow: 'hidden' }}>
        {!isLoading && <Skeleton variant='rectangular' height={600} fullWidth />}
        {isLoading && <Table columns={columns} rows={rows} path={route} parentIds={parentIds} />}
      </div>
      <div className='border bg-gray-50 shadow'>
        {!isLoading && <Skeleton variant='rectangular' height={600} />}
        {isLoading && (
          <>
            <div className='flex right-7 top-5 mx-8' ref={componentRef}>
              <strong className='mr-auto ml-auto'>{elementName}</strong>
              <ExportData componentToPrintRef={componentRef} data={dataToExport} />
            </div>
            <div className='h-96'>
              <PopulationChart data={totalPeople} labels={columns.slice(1)} scaleLabel={elementName} />
            </div>{' '}
          </>
        )}
      </div>
    </>
  )
}

export default ResultList
