import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchLogs } from 'src/api/other'

const LogDashboard = () => {
  const { t } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['log'],
    queryFn: () => fetchLogs()
  })

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{t('date')}</TableCell>
            <TableCell align='right'>{t('Responsable')}</TableCell>
            <TableCell align='right'>{t('Action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map(row => (
              <TableRow
                key={row.Date}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {row.Date}
                </TableCell>
                <TableCell align='right'>{row.Responsable}</TableCell>
                <TableCell align='right'>{row.Action}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LogDashboard
