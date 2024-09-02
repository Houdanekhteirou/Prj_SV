'use client'
import { useRef, useState, useEffect } from 'react'
import Table from 'src/@core/utilities/table/table'
import Scores from './scores'
import { fetchQualities } from 'src/api/other'

const Quanlities = ({ zoneId = '' }: { zoneId?: string }) => {
  const [data, setData] = useState({
    columns: [],
    rows: []
  })
  const [currentRow, setCurrentRow] = useState(null)

  const componentRef = useRef()

  useEffect(() => {
    fetchQualities(zoneId)
      .then(({ data }) => {
        const newData = {
          columns: convertToTrimValues(data.hearders),
          rows: data.data.map(row => {
            return {
              name: row['name'],
              id: row['id'],
              values: Object.values(row).filter((_, index) => index > 2)
            }
          })
        }
        setData(newData)
      })
      .catch(error => {
        console.error('error', error)
      })
  }, [zoneId])

  return (
    <>
      <h2 className='text-2xl border-b pb-3 pt-10'>{zoneId ? 'Qualités Régionales' : 'Qualités Nationales'}</h2>
      <div className='w-full bg-gray-50 relative' style={{ overflow: 'hidden' }}>
        <Table
          columns={data.columns}
          rows={data.rows}
          currentRow={currentRow}
          rowLabel={data.columns.length ? 'Zone' : ''}
        />
        {/* {currentRow && <Scores columns={data.columns} rows={data.rows} popupPosition={popupPosition} />} */}
      </div>
    </>
  )
}

function convertToTrimValues(yearsArray: string[]) {
  const trimValues = ['Trim. I', 'Trim. II', 'Trim. III', 'Trim. IV']
  const result: string[] = []

  yearsArray.forEach(value => {
    const year = value.split(' ')[0]
    const trimIndex = parseInt(year) % 4
    const trimValue = `${trimValues[trimIndex]} ${year}`
    result.push(trimValue)
  })

  return result
}
export default Quanlities
