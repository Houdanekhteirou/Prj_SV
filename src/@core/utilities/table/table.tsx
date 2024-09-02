import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Link from 'next/link'
import React from 'react'

interface Row {
  name: string
  values: number[]
}

const CustomTable = ({
  columns = [],
  rows = [],
  currentRow,
  rowLabel,
  className = '',
  headClassName = '',
  path = '',
  children,
  parentIds,
  action = () => {}
}: {
  columns?: string[]
  rows?: Row[]
  currentRow?: any
  rowLabel?: string
  className?: string
  headClassName?: string
  path?: string
  children?: any
  parentIds?: number[]
  action?: (event: React.MouseEvent<HTMLDivElement>, rowData: Row) => void
}) => {
  const handleRowEnter = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    const actionHasParameters = action && action.length > 0
    if (actionHasParameters) {
      action(event, rows[index])
    }
  }

  return (
    <div className={className} style={{ display: 'block', width: '100%', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow className={`${headClassName}`}>
            {rowLabel && <TableCell>{rowLabel}</TableCell>}
            {columns && columns.map((label, index) => <TableCell key={index}>{label}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {!children &&
            rows.map((item, index) => (
              <TableRow
                key={index}
                className={`border-y border-x hover ${
                  currentRow?.name !== item.name ? '' : 'text-rose-600 bg-zinc-300'
                }`}
                onMouseEnter={e => handleRowEnter(e.currentTarget, index)}
              >
                <TableCell className='text-primary'>
                  <Link href={path ? path + parentIds[index] : '#'} className={!path ? 'pointer-events-none' : ''}>
                    {item.name}
                  </Link>
                </TableCell>
                {item.values.map((value, index) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          {children && children}
        </TableBody>
      </Table>
    </div>
  )
}

export default CustomTable
