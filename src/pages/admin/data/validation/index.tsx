import { Icon } from '@iconify/react'
import { Button, Card, CardContent, CardHeader, MenuItem, Select, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { getTaskInstances, validateTaskInstance, publishTaskInstance } from 'src/api/data/validation'
import { getTasks } from 'src/api/tasks'

const statusENUM = {
  INELIGIBLE: 'INELIGIBLE',
  ELIGIBLE: 'ELIGIBLE',
  VALID: 'VALIDE',
  PUBLISHED: 'PUBLISHED'
}

const taskEnum = {
  regional: 'validation_regional',
  national: 'validation_national'
}

const Validation = () => {
  const { t } = useTranslation()
  const [selctedStatus, setSelectedStatus] = React.useState('')
  const [selectedTask, setSelectedTask] = React.useState('')
  const router = useRouter()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['taskInstances', selctedStatus, selectedTask],
    queryFn: () =>
      getTaskInstances({
        ...(selctedStatus && { 'status.equals': selctedStatus }),
        ...(selectedTask && { 'taskId.equals': selectedTask })
      })
  })

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const data = await getTasks()

      return data.filter(item => [taskEnum.regional, taskEnum.national].includes(item.name))
    }
  })

  console.log(tasks)

  const handleOpenDetails = id => {
    router.push(`/admin/data/validation/details?id=${id}`)
  }

  const handleValidate = async id => {
    try {
      await validateTaskInstance(id)
      refetch()
      toast.success(t('Task validated'))
    } catch (error) {
      toast.error(t('Error validating task'))
    }
  }

  const handlePublish = async id => {
    try {
      await publishTaskInstance(id)
      refetch()
      toast.success(t('Task published'))
    } catch (error) {
      toast.error(t('Error publishing task'))
    }
  }

  if (isLoading) {
    return <FallbackSpinner />
  }

  console.log(data)

  return (
    <Card className='p-2'>
      <CardHeader
        title={
          <div className='flex justify-between'>
            {t('tasks')}

            <div className='flex gap-2'>
              <Select
                variant='standard'
                value={selectedTask}
                onChange={e => setSelectedTask(e.target.value)}
                IconComponent={() => <Icon icon='bi:caret-down-fill' className='w-5 h-5' />}
              >
                <MenuItem value=''>{t('all')}</MenuItem>
                {tasks?.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
              <Select
                variant='standard'
                value={selctedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                IconComponent={() => <Icon icon='bi:caret-down-fill' className='w-5 h-5' />}
              >
                <MenuItem value=''>{t('all')}</MenuItem>
                {Object.values(statusENUM).map(item => (
                  <MenuItem key={item} value={item}>
                    {t(item)}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        }
      />

      <CardContent className='flex flex-wrap justify-around items-start gap-10'>
        {data?.map(item => (
          <CardTaskInstance
            key={item.id}
            item={item}
            t={t}
            handleOpenDetails={handleOpenDetails}
            handleValidate={handleValidate}
            handlePublish={handlePublish}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default Validation

const CardTaskInstance = ({ item, t, handleOpenDetails, handleValidate, handlePublish }) => {
  // ri-time-line

  return (
    <Card className='min-w-96'>
      <CardContent className='flex flex-col gap-6 '>
        <div className='flex justify-between'>
          <Typography variant='body1' className='mbe-1'>
            {item.taskName}
          </Typography>
          <Typography variant='body1' className='mbe-1'>
            {item.year} / {item.month}
          </Typography>
        </div>

        <div className='flex justify-between'>
          <Typography variant='body2' className='mbe-1'>
            {item.zoneName}
          </Typography>
          <div
            className={`bg-${
              item.status === statusENUM.INELIGIBLE ? 'red' : item.status === statusENUM.VALID ? 'green' : 'blue'
            }-500 rounded-md px-2 text-white `}
          >
            {item.status}
          </div>
        </div>

        <div className='flex justify-between'>
          <Button variant='text' color='primary' onClick={() => handleOpenDetails(item.id)}>
            {t('details')}
          </Button>

          {item.status === statusENUM.ELIGIBLE && item.taskUid !== taskEnum.national && (
            <Button variant='text' color='primary' onClick={() => handleValidate(item.id)}>
              {t('valider')}
            </Button>
          )}

          {item.status === statusENUM.VALID && item.taskUid === taskEnum.national && (
            <Button variant='text' color='primary' onClick={() => handlePublish(item.id)}>
              {t('publish')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
