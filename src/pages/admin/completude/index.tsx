import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { fetchCompletudeEntity, fetchCompletudeWilayaa } from 'src/api/completude/completude'
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { PERMISSIONS } from 'src/constants'

const Completude = () => {
  const { t } = useTranslation()
  // const [wilaya, setWilaya] = useState<string>('')
  const router = useRouter()

  const { data: data, isLoading } = useQuery({
    queryKey: ['completudeEntity', router.query.wilaya as string],
    queryFn: async () => {
      const wilaya = router.query.wilaya as string
      let res
      if (!wilaya) {
        const wilayasComle = await fetchCompletudeWilayaa()
        res = wilayasComle?.data.map((wilaya: any) => {
          const { id, statut, ...wilayaWithoutId } = wilaya // Destructure and exclude 'id'

          return {
            ...wilayaWithoutId,
            region: (
              <Link href={`/admin/completude?wilaya=${id}&name=${wilaya.region}`} className='text-green-500 underline'>
                {wilaya.region}
              </Link>
            )
          }
        })
      } else {
        const response = await fetchCompletudeEntity({ wilayaaId: wilaya })
        res = response?.data.map((entity: any) => {
          const { statut, ...entityWithoutStatus } = entity // Destructure and exclude 'status'

          return entityWithoutStatus
        })
      }

      return res
    }
  })

  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <Card>
        <div className='flex justify-between items-center px-4 py-3'>
          <CardHeader
            title={
              router.query.wilaya ? (
                <div className='flex gap-2 items-center'>
                  <Link href='/admin/completude'>
                    <Button variant='contained' color='primary'>
                      <Icon icon='akar-icons:arrow-left' width={20} height={20} />
                    </Button>
                  </Link>
                  <Typography variant='h6'>{router.query.name}</Typography>
                </div>
              ) : (
                <Typography variant='h6'>{t('completude')}</Typography>
              )
            }
          />
        </div>
        <Divider />
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <tr>
              {data &&
                Object.keys(data[0])?.map((key, index) => (
                  <TableCell
                    key={index}
                    className='py-3.5 px-3 ltr:text-left rtl:text-right text-sm font-semibold text-gray-900'
                  >
                    {t(key)}
                  </TableCell>
                ))}
            </tr>
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
              data?.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(item).map((value: any, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className='whitespace-nowrap truncate max-w-[27rem] px-3 py-4 text-sm text-gray-500'
                    >
                      {typeof value === 'boolean' ? (
                        value ? (
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            width='16px'
                            height='16px'
                            stroke='#116913'
                          >
                            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
                            <g id='SVGRepo_iconCarrier'>
                              {' '}
                              <path
                                d='M4 12.6111L8.92308 17.5L20 6.5'
                                stroke='#116913'
                                stroke-width='5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              ></path>{' '}
                            </g>
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16px'
                            height='16px'
                            viewBox='0 0 24 24'
                            fill='red'
                          >
                            <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
                          </svg>
                        )
                      ) : (
                        value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  )
}

Completude.acl = [PERMISSIONS.completeness.read]

export default Completude
