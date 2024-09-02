// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Icon from 'src/@core/components/icon'

import { Box } from '@mui/system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { formatNumberWithSpaces, hasPermission } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'

interface Column {
  id: string
  name: string
  format?: boolean
  img?: boolean
  icon?: boolean
}

interface Data {
  [key: string]: any
}

type SpecialAction = (row: any) => JSX.Element | null

interface TableProps {
  columns: Column[]
  data: Data[]
  isLoading: boolean
  primaryKey: string
  specialActions?: SpecialAction[]

  actions?: {
    name: string
    icon: string
    handler: (id: string) => void
    color: string
    confirmation?: boolean
    requiredPermissions?: string[]
    rowData?: true | false
    checkKey?: string
  }[]
  refetchPagination?: (page: number, rowsPerPage: number) => void
  count?: number
  pagination?: {
    pageNumber: number
    pageSize: number
  }
  columnOrder?: string
  columnOrderDirection?: 'asc' | 'desc'
  filterFields?: any[]
}

const DynamicTable: React.FC<TableProps> = ({
  columns,
  data,
  isLoading,
  primaryKey,
  actions,
  specialActions,
  refetchPagination = null,
  pagination,
  count = null,
  columnOrder = null,
  columnOrderDirection = 'asc',
  filterFields
}) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<string>('')
  const { t } = useTranslation()

  useEffect(() => {
    if (pagination) {
      setPage(pagination.pageNumber)
      setRowsPerPage(pagination.pageSize)
    }
    if (columnOrder) {
      setOrderBy(columnOrder)
      setOrder(columnOrderDirection)
    }
  }, [pagination, columnOrder, columnOrderDirection])

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortData = (array: Data[]) => {
    if (!orderBy) return array

    return array.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    refetchPagination(newPage, rowsPerPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = +event.target.value
    setRowsPerPage(newRowsPerPage)
    refetchPagination(page, newRowsPerPage)
  }

  return (
    <>
      {filterFields && (
        <Box
          sx={{
            p: 5,
            pb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            gap: 2
          }}
        >
          {RenderFilterFields(filterFields)}
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns?.map(column => (
                <TableCell key={column.id} sortDirection={orderBy === column.id ? order : false}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {t(column.name)}
                  </TableSortLabel>
                </TableCell>
              ))}
              {actions && actions.length > 0 && <TableCell>{t('Action')}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns?.length + (actions && actions?.length > 0 ? 1 : 0)}>
                  {(Array.from(Array(rowsPerPage).keys()) as number[]).map((_, index) => (
                    <Skeleton key={index} height={50} />
                  ))}
                </TableCell>
              </TableRow>
            ) : (
              sortData(data)?.map((row, index) => {
                return (
                  <TableRow hover className='cursor-pointer' role='checkbox' tabIndex={-1} key={row[primaryKey]}>
                    {columns?.map(column => {
                      return (
                        <RenderCell
                          onClick={() =>
                            actions && actions.length > 0 && actions.find(action => action.name === 'View')?.rowData
                              ? actions.find(action => action.name === 'View')?.handler(row)
                              : actions.find(action => action.name === 'View')?.handler(row.id)
                          }
                          key={column.id}
                          column={column}
                          row={row}
                          index={index + 1 + rowsPerPage * page}
                        />
                      )
                    })}
                    {actions && actions.length > 0 && (
                      <TableCell>
                        <RowOptions row={row} actions={actions} specialActions={specialActions} />
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {count !== null && refetchPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 15, 20, 25]}
          component='div'
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('Rows per page')}
        />
      )}
    </>
  )
}

export default DynamicTable

const RenderCell = ({ column, row, index, onClick }) => {
  const getValue = () => {
    if (column.id.includes('.')) {
      const [parentKey, childKey] = column.id.split('.')

      return row[parentKey][childKey]
    }

    return row[column.id]
  }

  const renderContent = () => {
    if (column.id === 'id') {
      return (
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          {index}
        </Typography>
      )
    } else if (column.format) {
      return formatNumberWithSpaces(getValue())
    } else if (column.img) {
      return <Image src={`${process.env.NEXT_PUBLIC_API_URP}/${getValue()}`} alt='img' width={50} height={50} />
    } else if (column.icon) {
      return <Icon icon={getValue()} />
    } else {
      return getValue()
    }
  }

  return (
    <TableCell onClick={(row.id !== '0' && onClick) || null} key={column.id}>
      {renderContent()}
    </TableCell>
  )
}

const RowOptions = ({ row, actions, specialActions }: { row: any; actions: any; specialActions: any }) => {
  // ** Hooks
  const auth = useAuth()
  const { authorities } = auth.user
  const { t } = useTranslation()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  if (auth.loading) {
    return null
  }

  // if the actions are only one don't show the menu
  if (actions.length === 1) {
    return (
      <div className='flex'>
        <IconButton size='small' onClick={() => actions[0].handler(row.id)}>
          <Icon icon={actions[0].icon} color={actions[0].color} />
        </IconButton>
        {specialActions?.map((action, index) => (
          <div key={index}>{action(row)}</div>
        ))}
      </div>
    )
  }

  return (
    <div className='flex'>
      {specialActions?.map((action, index) => (
        <div className='align-middle' key={index}>
          {action(row)}
        </div>
      ))}
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        {actions.map(
          action =>
            (!action.requiredPermissions || hasPermission(authorities, action.requiredPermissions)) && (
              <MenuItem className='align-middle' key={action.name} disabled={!CheckKey(row, action.checkKey)}>
                <Button
                  variant='text'
                  size='small'
                  sx={{ color: action.color, mr: 2 }}
                  onClick={() => (action.rowData ? action.handler(row) : action.handler(row.id))}
                >
                  <Box component='span' sx={{ color: action.color, mr: 2 }}>
                    <Icon icon={action.icon} />
                  </Box>
                  {t(action.name)}
                </Button>
              </MenuItem>
            )
        )}
      </Menu>
    </div>
  )
}

const CheckKey = (row, key) => {
  if (!key) return true

  return row[key]
}

const RenderFilterFields = fields => {
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    fields.forEach(field => {
      const value = router.query[field.name]
      field.onChange({
        target: {
          value: value || ''
        }
      })
    })
  }, [router.query, fields])

  const handleTextFieldChange = index => event => {
    const value = event.target.value
    const query = { ...router.query, [fields[index].name]: value }
    router.push({ query })
  }

  const handleSelectChange = (index, newValue) => {
    const value = newValue ? newValue.value : ''
    const query = { ...router.query, [fields[index].name]: value }
    router.push({ query })
  }

  return fields.map((field, index) => {
    if (field.type === 'text') {
      return (
        <FormControl key={index} sx={{ minWidth: 200 }}>
          <TextField
            id={`filter-text-${index}`}
            size='medium'
            sx={{ mr: 4, mb: 2 }}
            value={field.value || ''}
            label={t(field.label)}
            onChange={handleTextFieldChange(index)}
          />
        </FormControl>
      )
    } else if (field.type === 'select') {
      return (
        <FormControl key={index} fullWidth sx={{ mr: 4, mb: 2 }}>
          <Autocomplete
            id={`filter-autocomplete-${index}`}
            options={field.options || []}
            getOptionLabel={option => t(option.label)}
            value={field.options?.find(option => option.value == field.value) || null}
            clearOnEscape
            onChange={(event, newValue) => handleSelectChange(index, newValue)}
            renderInput={params => <TextField {...params} label={t(field.label)} size='medium' />}
            fullWidth
          />
        </FormControl>
      )
    }
  })
}
