import { useTranslation } from 'react-i18next'
import Table1 from './table'

const TableStats = ({ data, setTableDataValueTypes, tableDataValueTypes, valueTypes }) => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col p-10 gap-4'>
      <p
        className=' text-2xl font-bold'
        style={{
          color: '#189C39'
        }}
      >
        {t('TABLEAU')}
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
                tableDataValueTypes === valueType.value ? 'bg-green-500 bg-opacity-20' : 'border-b-2 border-transparent'
              }
              onClick={() => setTableDataValueTypes(valueType.value)}
            >
              {valueType.title}
            </p>
          ))}
      </div>
      {data && <Table1 data={data} />}
    </div>
  )
}

export default TableStats
