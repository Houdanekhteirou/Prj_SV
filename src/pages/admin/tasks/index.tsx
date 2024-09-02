import { Avatar, Button, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import FallbackSpinner from 'src/@core/components/spinner'
import { getTasks } from 'src/api/tasks'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export default function Tasks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks()
  })
  const { t } = useTranslation()

  if (isLoading) return <FallbackSpinner />

  return (
    <Card className='p-2'>
      <CardHeader title={t('tasks')} />

      <CardContent className='flex flex-wrap justify-start items-start gap-10'>
        {data?.map(task => (
          <CardTask key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  )
}

const getCronDate = (cron: string) => {
  // cronFromat = m-h-dayOfWeek-dayOfMonth-month-y

  const [minutes, hours, dayOfWeek, dayOfMonth, month, year] = cron.split(';')

  return {
    minutes,
    hours,
    dayOfWeek,
    dayOfMonth,
    month,
    year
  }
}

const CardTask = ({ task }) => {
  const startCron = getCronDate(task.startCron)
  const endCron = getCronDate(task.endCron)
  const router = useRouter()
  const { t } = useTranslation()

  // ri-time-line

  return (
    <Card className='min-w-96'>
      <CardContent className='flex flex-col gap-6 '>
        <div>
          <Typography variant='h5' className='mbe-1'>
            {task.title}
          </Typography>
        </div>
        <div>
          <Typography variant='body1' className='mbe-1'>
            {task.description}
          </Typography>
        </div>

        <div className='flex justify-around'>
          <Avatar
            variant='rounded'
            sx={{
              backgroundColor: 'green'
            }}
          >
            <Icon icon={'ri-calendar-line'} color='white' />
          </Avatar>
          <Avatar
            variant='rounded'
            sx={{
              backgroundColor: 'green'
            }}
          >
            <Icon icon={'ri-time-line'} color='white' />
          </Avatar>
        </div>
        <div>
          <Typography variant='h6' className='mbe-1 text-center underline'>
            {t('debut Cron')}
          </Typography>
        </div>
        <div className='flex flex-wrap justify-around gap-4'>
          <div className='flex flex-col  gap-4 '>
            <div className='flex flex-col gap-0.5'>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>year</span>
                <span>{startCron.year}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>month</span>
                <span>{startCron.month}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>dayOfMonth</span>
                <span>{startCron.dayOfMonth}</span>
              </div>
            </div>
          </div>
          <div className='flex  gap-4 flex-col'>
            <div className='flex flex-col gap-0.5'>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>hours</span>
                <span>{startCron.hours}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>minutes</span>
                <span>{startCron.minutes}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Typography variant='h6' className='mbe-1 text-center underline'>
            {t('End Cron')}
          </Typography>
        </div>

        <div className='flex flex-wrap justify-around gap-4'>
          <div className='flex flex-col  gap-4 '>
            <div className='flex flex-col gap-0.5'>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>year</span>
                <span>{endCron.year}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>month</span>
                <span>{endCron.month}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>dayOfMonth</span>
                <span>{endCron.dayOfMonth}</span>
              </div>
            </div>
          </div>
          <div className='flex  gap-4 flex-col'>
            <div className='flex flex-col gap-0.5'>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>hours</span>
                <span className='flex-end'>{endCron.hours}</span>
              </div>
              <div className='flex gap-2 justify-between'>
                <span className='bold text-black'>minutes</span>
                <span>{endCron.minutes}</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant='text' color='primary' onClick={() => router.push(`/admin/tasks/form?id=${task.id}`)}>
          {t('Edit')}
        </Button>
      </CardContent>
    </Card>
  )
}
