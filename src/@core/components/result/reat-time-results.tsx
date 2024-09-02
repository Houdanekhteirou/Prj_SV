import { List, ListItem } from '@mui/material'
import { useEffect, useState } from 'react'
import React from 'react'
import { fetchRealTimeResult } from 'src/api/other'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import Link from 'next/link'

const Result = ({ zoneId = '' }: { zoneId?: string }) => {
  const [realResults, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setIsLoading(false)
    fetchRealTimeResult(zoneId)
      .then(res => {
        setResults(res.data)
        setIsLoading(true)
      })
      .catch(error => {
        console.error('error', error)
      })
  }, [zoneId])

  return (
    <div className='grid gap-x-8 gap-y-8 grid-cols-300-1 pt-5'>
      {/* <h5 className='font-semibold border-b'>{t('key_data')}</h5> */}
      <h2 className='text-2xl border-b'>{t('realtime_results')}</h2>
      {/* <div className='overflow-x-auto'>
         <List>
          {jsonDataKeys.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <strong className='text-primary mr-2'>{item.total}</strong>
                <p>{item.title}</p>
              </ListItem>
              <Divider component='li' />
            </React.Fragment>
          ))}
        </List>
      </div> */}
      {!isLoading && <Skeleton variant='rectangular' height={600} />}
      {isLoading && (
        <div className='grid result xl:gap-x-6 xl:gap-y-6 bg-gray-50 md:gap-y-3 md:gap-x-3'>
          {realResults.map((item, index) => (
            <div key={index} className='px-4'>
              <div className='flex items-center gap-x-2.5'>
                <img
                  src={process.env.NEXT_PUBLIC_API_URP + '/' + item.icon}
                  alt='entity icon'
                  className='h-16 w-16 min-w-max'
                />
                <Link href={`/data_pbf/${item.id + '&' + item.title}`} className='min-w-max'>
                  <h2 className='stat-value text-primary'>{item.total}</h2>
                </Link>
              </div>
              <div className='home-desc'>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Result
