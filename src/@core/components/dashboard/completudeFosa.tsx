import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchCompletudeWilayaa } from 'src/api/completude/completude'

const CompletudeFOSA = () => {
  const { t } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['completudeWilaya'],
    queryFn: () => fetchCompletudeWilayaa()
  })

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{t('REGION')}</TableCell>
            <TableCell align='right'>{t('Geo')}</TableCell>
            <TableCell align='right'>{t('Photo')}</TableCell>
            <TableCell align='right'>{t('Pop')}</TableCell>
            <TableCell align='right'>{t('Statut')}</TableCell>
            <TableCell align='right'>{t('Resp')}</TableCell>
            <TableCell align='right'>{t('Email')}</TableCell>
            <TableCell align='right'>{t('Tel')}</TableCell>
            <TableCell align='right'>{t('Banque')}</TableCell>
            <TableCell align='right'>{t('percentage')}</TableCell>
            <TableCell align='right'>{t('total')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={12}>
                {(Array.from(Array(9).keys()) as number[]).map((_, index) => (
                  <Skeleton key={index} height={50} />
                ))}
              </TableCell>
            </TableRow>
          ) : (
            data?.data?.map(row => (
              <TableRow
                key={row.region}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {row.region}
                </TableCell>
                <TableCell align='right'>{row.geo}</TableCell>
                <TableCell align='right'>{row.photo}</TableCell>
                <TableCell align='right'>{row.population}</TableCell>
                <TableCell align='right'>{row.statut}</TableCell>
                <TableCell align='right'>{row.responsable}</TableCell>
                <TableCell align='right'>{row.email}</TableCell>
                <TableCell align='right'>{row.tel}</TableCell>
                <TableCell align='right'>{row.banque}</TableCell>
                <TableCell align='right'>{parseFloat(row.percentage).toFixed(2) + '%'}</TableCell>
                <TableCell align='right'>{row.totalEntities}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CompletudeFOSA
