import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { years } from 'src/@core/utils'
import EntitesPopPup from './entitiesPopUp'

const CompletudeFileType = ({ data, year, setYear, quarter, setQuarter }) => {
  const { t } = useTranslation()

  const [popUpData, setPopUpData] = React.useState<any>(null)
  const [open, setOpen] = React.useState(false)

  const months = React.useMemo(() => {
    switch (quarter) {
      case 1:
        return [t('january'), t('february'), t('march')]
      case 2:
        return [t('april'), t('may'), t('june')]
      case 3:
        return [t('july'), t('august'), t('september')]
      case 4:
        return [t('october'), t('november'), t('december')]
      default:
        return []
    }
  }, [quarter, t])

  const showLeftEntites = (row: any, m) => {
    let month
    if (row.totalmonth1 === 0 && m === 1) return
    if (row.totalmonth2 === 0 && m === 2) return
    if (row.totalmonth3 === 0 && m === 3) return

    if (row.month1 === 0 && m === 3) month = quarter
    else {
      // for exemple if the trim is 2 and the month is 1 then the month is  4
      month = m + (quarter - 1) * 3
    }
    setPopUpData({
      fileType: row.fileType,
      month: month,
      year: year,
      id: row.id
    })
    setOpen(true)
  }

  return (
    <Card>
      <div className='flex w-full flex-wrap items-center justify-center gap-2 p-2'>
        {t('completudeDonnes') + ' [' + 'T' + quarter + ',' + year + ']'}
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>{t('trimestre')}</InputLabel>
          <Select
            value={quarter}
            onChange={e => setQuarter(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            label={t('trimestre')}
          >
            <MenuItem value={1}>{1}</MenuItem>
            <MenuItem value={2}>{2}</MenuItem>
            <MenuItem value={3}>{3}</MenuItem>
            <MenuItem value={4}>{4}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>{t('year')}</InputLabel>
          <Select
            value={year}
            onChange={e => setYear(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            label={t('year')}
          >
            {years.map((year, index) => (
              <MenuItem key={index} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <CardContent>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>{t('fileType')}</TableCell>
                {months.map((month, index) => (
                  <TableCell key={index} align='right'>
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row.title}
                  </TableCell>
                  <TableCell align='right'>
                    <div
                      className={
                        row.totalmonth1 > row.month1 ? 'text-green-500 underline underline-offset-1 cursor-pointer' : ''
                      }
                      onClick={() => row.totalmonth1 > row.month1 && row.totalmonth1 && showLeftEntites(row, 1)}
                    >
                      {row.month1 + '/' + row.totalmonth1}
                    </div>
                  </TableCell>
                  <TableCell align='right'>
                    <div
                      className={
                        row.totalmonth2 > row.month2 ? 'text-green-500 underline underline-offset-1 cursor-pointer' : ''
                      }
                      onClick={() => row.totalmonth2 > row.month2 && row.totalmonth2 && showLeftEntites(row, 2)}
                    >
                      {row.month2 + '/' + row.totalmonth2}
                    </div>
                  </TableCell>
                  <TableCell align='right'>
                    <div
                      className={
                        row.totalmonth3 > row.month3 ? 'text-green-500 underline underline-offset-1 cursor-pointer' : ''
                      }
                      onClick={() => row.totalmonth3 > row.month3 && row.totalmonth3 && showLeftEntites(row, 3)}
                    >
                      {row.month3 + '/' + row.totalmonth3}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      {popUpData && <EntitesPopPup open={open} setOpen={setOpen} {...popUpData} />}
    </Card>
  )
}

export default CompletudeFileType
