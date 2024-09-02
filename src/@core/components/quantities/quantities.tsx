'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import { FaDownload, FaPlusCircle } from 'react-icons/fa'
import ExportData from '../../utilities/export/ExportData'
import { downloadExcel } from '../../utilities/download/download'

import Table from '../../utilities/table/table'
import PopulationChart from '../chart/PopulationGraph'
import { fetchQuanities } from '../../../api/other'

const months = ['Janvier 2019', 'Fevrier 2019', 'Mars 2019', 'Avril 2019', 'Mai 2019', 'Juin 2019']

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

const Quantities = ({ zoneId = '' }: { zoneId?: string }) => {
  const [data, setData] = useState({
    columns: [],
    rows: []
  })
  const [dataToExport, setDataToExport] = useState([])

  const [currentRow, setCurrentRow] = useState(null)
  const [chartPosition, setChartPosition] = useState({ top: 0, left: 0 })

  const componentRef = useRef()
  const { t } = useTranslation()
  useEffect(() => {
    fetchQuanities(zoneId)
      .then(({ data }) => {
        const newData = {
          columns: convertToTrimValues(data.hearders),
          rows: data.data.map(row => {
            return {
              name: row['name'],
              id: row['id'],
              values: Object.values(row).filter((_, index) => index > 1)
            }
          })
        }
        setData(newData)
        setDataToExport(data.data)
      })
      .catch(error => {
        console.error('error', error)
      })
  }, [zoneId])

  const handleRowHover = (rowEvent, row) => {
    if (rowEvent && row !== currentRow) {
      // Get the position of the hovered row
      const rect = rowEvent.getBoundingClientRect()
      console
      const position = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      }

      // Set the new chart data and position in the state
      setCurrentRow(row)
      setChartPosition(position)
    } else if (!rowEvent) {
      setCurrentRow(null)
    }
  }

  const handleRowLeave = () => {
    setCurrentRow(null)
  }

  return (
    <>
      <h2 className='text-2xl border-b pb-3 pt-10'>{zoneId ? t('Quantités Régionales') : t('Quantités Nationales')}</h2>
      <div className='w-full bg-gray-50 relative' style={{ overflow: 'hidden' }} onMouseLeave={handleRowLeave}>
        <Table
          columns={data.columns}
          rows={data.rows}
          action={handleRowHover}
          currentRow={currentRow}
          rowLabel={data.columns.length ? 'Zone' : ''}
        />
        {currentRow && (
          <div
            className='popup-chart-container p-5 absolute'
            style={{ top: chartPosition.top - 100, left: chartPosition.left + 400, width: '442px' }}
            ref={componentRef}
          >
            <div className='absolute top-5' style={{ top: '1.75rem', right: '2.75rem' }}>
              <ExportData componentToPrintRef={componentRef} data={currentRow} />
            </div>
            <div style={{ height: '375px' }} className='bg-white'>
              <PopulationChart data={currentRow?.values} labels={months} scaleLabel='Quantité Nationale' />
            </div>
          </div>
        )}
      </div>
      <div className='mt-4'>
        <Button variant='contained' color='error' onClick={() => downloadExcel(dataToExport)}>
          Export
        </Button>
      </div>
    </>
  )
}

export default Quantities
