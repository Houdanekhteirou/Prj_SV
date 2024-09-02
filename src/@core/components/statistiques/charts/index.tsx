import { useTranslation } from 'react-i18next'
import RechartsLineChart from './LineChart'
import FallbackSpinner from '../../spinner'
import { useRef } from 'react'

export const ChartStats = ({ data, graphDataValueTypes, setGraphDataValueTypes, valueTypes }) => {
  const { t } = useTranslation()

  // chart ref for the line chart
  const chartRef = useRef(null)

  return (
    <div
      className='flex flex-wrap md:flex-col p-10 gap-4'
      style={{
        backgroundColor: '#F6F7F0'
      }}
    >
      <p
        className=' text-2xl font-bold'
        style={{
          color: '#CE2026'
        }}
      >
        {t('GRAPHIQUES')}
      </p>
      <div className='flex gap-5'>
        {valueTypes.length > 0 &&
          valueTypes.map((valueType, index) => (
            <p
              key={index}
              style={{
                fontSize: '1rem',
                color: 'black',
                borderRight: '3px solid #189C39',
                paddingRight: '10px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 10px'
              }}
              className={
                graphDataValueTypes === valueType.value ? 'bg-green-500 bg-opacity-20' : 'border-b-2 border-transparent'
              }
              onClick={() => setGraphDataValueTypes(valueType.value)}
            >
              {valueType.title}
            </p>
          ))}
      </div>
      <div>{data && <RechartsLineChart data={data} chartRef={chartRef} />}</div>
    </div>
  )
}
