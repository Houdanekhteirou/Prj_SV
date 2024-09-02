'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormFieldGroup } from 'src/@core/utils'
import * as yup from 'yup'
import ItemRenderer from './ItemRenderer'
import SubmitButton from './SubmitButton'

const CustomEditor = dynamic(() => import('./customEditor'), { ssr: false })

export type Fields = FormField[]

interface FormRendererProps {
  fields: Fields
  validationSchema: yup.ObjectSchema<any>
  initialValues?: any
  readOnly?: boolean
  onSubmit: (data: any) => void
  updating?: boolean
  stopTheGrid?: boolean
  title: React.ReactNode
  closeButton?: boolean
  extraComponent?: React.ReactNode
  disp?: boolean
  groups?: FormFieldGroup[]
  extraFields?: FormField[]
  backButton?: ((data: any) => void) | null
  submitButtonText?: string
  alertCompnent?: any
}

const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  validationSchema,
  initialValues = {},
  readOnly = false,
  onSubmit,
  updating = false,
  stopTheGrid = false,
  title,
  closeButton = true,
  extraComponent = null,
  groups = [],
  extraFields = [],
  backButton = null,
  submitButtonText = undefined,
  alertCompnent = () => <></>
}) => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  })
  const watch = methods.watch()
  const router = useRouter()
  const { t } = useTranslation()

  const renderFields = (fields: Fields, filterCondition: (field: FormField) => boolean) =>
    fields?.filter(filterCondition).map(field => (
      <div className={` ${field.className} `} key={field.name}>
        <Grid item xs={12} sm={6} key={field.name}>
          <ItemRenderer readOnly={readOnly ? true : field.readOnly} item={field} />
        </Grid>
      </div>
    ))

  const renderFormFields = (fields: Fields) => (
    <div>
      <div className={!stopTheGrid ? `grid gap-4 grid-cols-1  lg:grid-cols-4 mb-5 gap-x-4 gap-y-4 mt-4` : ''}>
        {groups.length > 0 &&
          groups
            .filter(group => fields?.some(field => field.groupKey === group.id))
            .map(group => (
              <React.Fragment key={group.id}>
                <div className='col-span-full my-2'>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {t(group.name)}
                  </Typography>
                </div>
                {renderFields(fields, field => field.groupKey === group.id)}
                <div className='col-span-full'>
                  <Divider sx={{ mb: '0 !important' }} />
                </div>
              </React.Fragment>
            ))}
      </div>
      <div className={!stopTheGrid ? `grid gap-4 grid-cols-1  lg:grid-cols-4 mb-5 gap-x-4 gap-y-4 mt-4` : ''}>
        {renderFields(fields, field => !field.groupKey)}
      </div>
    </div>
  )

  return (
    <div className={extraComponent ? 'grid gap-4 grid-cols-1 sm:grid-cols-3' : ''}>
      <Card className={extraComponent ? 'col-span-2' : ''}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {title && (
              <>
                <CardHeader title={typeof title === 'string' ? t(title) : title} />
                <Divider sx={{ m: '0 !important' }} />
              </>
            )}
            {alertCompnent()}

            {/* <CardContent>

            </CardContent> */}
            <CardContent
              className={`w-full  ${
                extraFields.length > 0
                  ? stopTheGrid
                    ? 'grid gap-4 grid-cols-1 sm:grid-cols-2'
                    : 'grid gap-4 grid-cols-1 sm:grid-cols-3'
                  : ''
              }`}
            >
              <div className={stopTheGrid ? `col-span-1` : 'col-span-2'}>{renderFormFields(fields)}</div>
              {extraFields.length > 0 && (
                <div className='border-2 p-4 bg-slate-400 bg-opacity-5'>{renderFormFields(extraFields)}</div>
              )}
            </CardContent>
            <Divider sx={{ m: '0 !important' }} />
            <CardActions>
              {!readOnly && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', marginTop: '10px', width: '100%' }}>
                  {closeButton ? (
                    <Button
                      disabled={methods.formState.isSubmitting || updating}
                      onClick={
                        backButton
                          ? () => {
                              if (typeof backButton === 'function') {
                                backButton(watch)
                              } else {
                                router.back()
                              }
                            }
                          : () => router.back()
                      }
                      size='medium'
                      variant='outlined'
                    >
                      {backButton ? t('back') : t('cancel')}
                    </Button>
                  ) : null}
                  <SubmitButton
                    disabled={methods.formState.isSubmitting || updating}
                    onSubmit={methods.handleSubmit(onSubmit)}
                    fullWidth
                    label={submitButtonText}
                  />
                </Box>
              )}
            </CardActions>
          </form>
        </FormProvider>
      </Card>
      {extraComponent && <div className='col-span-1'>{extraComponent}</div>}
    </div>
  )
}

export default FormRenderer
