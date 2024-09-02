import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchFrequencieHistory } from 'src/api/data/frequency'

const History = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { id } = router.query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', id],
    queryFn: () => fetchFrequencieHistory(parseInt(id as string)),
    enabled: !!id
  })

  if (isLoading)
    return (
      <div>
        <FallbackSpinner />
      </div>
    )

  return (
    <Card>
      <CardHeader title='Historique' />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('author')}</TableCell>
              <TableCell>{t('fileActivity')}</TableCell>
              <TableCell>{t('date')}</TableCell>
              <TableCell>{t('description')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.authorName}</TableCell>
                <TableCell>{item.fileActivity}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default History
