'use client'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getTask } from 'src/api/tasks'
import FallbackSpinner from 'src/@core/components/spinner'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'
import { TextField, Button, Grid, Typography, Card, CardHeader, CardContent, CardActions } from '@mui/material'

const Form = () => {
  const { t } = useTranslation()
  const router = useRouter()
  let { id } = router.query
  const { control, handleSubmit, setValue } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(id),
    enabled: !!id
  })

  useEffect(() => {
    if (data) {
      setValue('startCron', data.startCron)
      setValue('endCron', data.endCron)
    }
  }, [data, setValue])

  if (isLoading || !data) {
    return <FallbackSpinner />
  }

  const onSubmit = data => {
    const cronObject = {
      title: 'Validation UT-FBR',
      description: null,
      startCron: data.startCron,
      endCron: data.endCron
    }

    console.log(cronObject)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title={t('Edit') + ' ' + data.title} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name='startCron'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('debut Cron')}
                    type='text'
                    fullWidth
                    helperText='Format: m;h;dayOfWeek;dayOfMonth;month;y'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='endCron'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('End Cron')}
                    type='text'
                    fullWidth
                    helperText='Format: m;h;dayOfWeek;dayOfMonth;month;y'
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type='submit' variant='contained' color='primary' style={{ marginTop: '20px' }}>
            {t('submit')}
          </Button>
          <Button variant='contained' color='secondary' sx={{ marginTop: '20px' }} onClick={() => router.back()}>
            {t('cancel')}
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

export default Form
