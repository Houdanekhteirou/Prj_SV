import { useRouter } from 'next/router'

import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getTaskInstance } from 'src/api/data/validation'
import FallbackSpinner from 'src/@core/components/spinner'
import { Card, Typography } from '@mui/material'

const Details = () => {
  const { t } = useTranslation()
  const router = useRouter()
  let { id } = router.query

  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskInstance(id),
    enabled: !!id
  })

  if (isLoading || !data) {
    return <FallbackSpinner />
  }

  console.log(data)

  return (
    <Card className='flex flex-col justify-center p-4 gap-4 '>
      <div className='flex justify-around w-full'>
        <Typography variant='body1' className='mb-4'>
          {data.taskName}
        </Typography>
        <Typography variant='h6' className='mb-4'>
          {data.zoneName}
        </Typography>
        <Typography variant='body1' className='mb-4'>
          {data.month}/{data.year}
        </Typography>
      </div>
      <div className='flex justify-around w-full flex-wrap '>
        {Object.keys(data.details).map((key, index) => {
          if (data.details[key].length > 0)
            return (
              <div className='flex flex-col gap-4'>
                <Typography variant='body1' className='mb-4'>
                  {t(key)}
                </Typography>
                <div className='flex flex-col h-64 overflow-y-scroll overflow-y-visible'>
                  {data.details[key].map(entity => (
                    <Typography variant='body2' key={entity.id}>
                      {entity.name}
                    </Typography>
                  ))}
                </div>
              </div>
            )
        })}
      </div>
    </Card>
  )
}

export default Details
