import { TableCell, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const Table1 = ({ data }) => {
  const [startMonthIndex, setStartMonthIndex] = useState(0)
  const [numMonths, setNumMonths] = useState(3)

  const handleNextMonths = () => {
    const nextStartIndex = startMonthIndex + numMonths
    if (nextStartIndex <= data.headers.length - numMonths) {
      setStartMonthIndex(nextStartIndex)
    }
  }

  const handlePreviousMonths = () => {
    const previousStartIndex = startMonthIndex - numMonths
    if (previousStartIndex >= 0) {
      setStartMonthIndex(previousStartIndex)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setNumMonths(3)
      } else if (window.innerWidth < 1024) {
        setNumMonths(6)
      } else {
        setNumMonths(12)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className='overflow-x-auto '>
      <table
        className='w-full table-auto '
        style={{
          borderSpacing: '0px',
          borderCollapse: 'collapse',
          border: '1px solid #CCCCCC',
          color: 'black'
        }}
      >
        <thead>
          <TableRow
            style={{
              backgroundColor: '#F2F2F2',
              height: '60px'
            }}
          >
            {/* <th
              className='px-4 py-2'
              style={{
                borderRight: '2px solid #CCCCCC'
              }}
            ></th> */}
            <th
              // border
              className='  px-4 py-2 '
              style={{
                width: '300px',
                borderRight: '2px solid #CCCCCC'
              }}
            ></th>
            {data.headers.slice(startMonthIndex, startMonthIndex + numMonths).map((header, index) => (
              <th
                key={index}
                className='px-4 py-2'
                style={{
                  borderRight: '2px solid #CCCCCC'
                }}
              >
                <div className='flex justify-between items-center'>
                  {startMonthIndex > 0 && index === 0 && (
                    <div
                      className='w-4 bg-green-500 flex items-center cursor-pointer h-10'
                      onClick={handlePreviousMonths}
                    >
                      <IconifyIcon icon='akar-icons:chevron-left' className='text-white' />
                    </div>
                  )}
                  {header}

                  {startMonthIndex + numMonths < data.headers.length &&
                    data.headers.slice(startMonthIndex, startMonthIndex + numMonths).length === index + 1 && (
                      <div
                        className='w-4 bg-green-500 flex items-center cursor-pointer h-10 '
                        onClick={handleNextMonths}
                      >
                        <IconifyIcon icon='akar-icons:chevron-right' className='text-white' />
                      </div>
                    )}
                </div>
              </th>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <>
              <TableRow className='border px-4 py-2'>
                {/* <TableCell
                  className='px-4 py-2 '
                  style={{
                    // borderRight: '2px solid #CCCCCC',
                    fontWeight: 'bold'
                  }}
                ></TableCell>{' '} */}
                <TableCell colSpan={numMonths + 1}>
                  <div
                    className='w-full h-14 flex items-center text-black pl-4 justify-center'
                    style={{
                      backgroundColor: '#99E8BF'
                    }}
                  >
                    {row.element}
                  </div>
                </TableCell>
              </TableRow>

              {row.subRows.map((subRow, index) => (
                <TableRow
                  key={index}
                  // className='border px-4 py-2'
                  // change the background color of the row based on the index of the row if it is even or odd
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F3F4F6'
                  }}
                >
                  {/* <TableCell
                    className='px-4 py-2'
                    style={{
                      borderRight: '2px solid #CCCCCC',
                      fontWeight: 'bold'
                    }}
                  >
                    {i + 1} - {index + 1}
                  </TableCell> */}
                  <TableCell
                    className='px-4 py-2'
                    style={{
                      borderRight: '2px solid #CCCCCC',
                      fontWeight: 'bold'
                    }}
                  >
                    {subRow.name}
                  </TableCell>
                  {subRow.values.slice(startMonthIndex, startMonthIndex + numMonths).map((value, index) => (
                    <TableCell
                      key={index}
                      className='px-4 py-2'
                      style={{
                        borderRight: '2px solid #CCCCCC'
                      }}
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ))}
        </tbody>
      </table>
      <div className='flex justify-end mt-4'></div>
    </div>
  )
}

export default Table1
