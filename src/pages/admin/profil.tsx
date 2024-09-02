'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardActions, CardContent, CardHeader, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useQuery } from '@tanstack/react-query'
import { use, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import SignatureCanvas from 'react-signature-canvas'
import FallbackSpinner from 'src/@core/components/spinner'
import { changePassword, changeSignature } from 'src/api/access-management/users/users'
import { getAccount, updateAccount } from 'src/api/auth'
import * as yup from 'yup'

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required')
})

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup.string().required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required')
})

const UserProfileForm = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      twitter: '',
      telegram: '',
      facebook: '',
      birthday: '',
      birthPlace: '',
      jobTitle: '',
      introduction: '',
      education: ''
    }
  })

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword }
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [signature, setSignature] = useState(null)

  const { data: accountData, isLoading } = useQuery({
    queryKey: ['account', 'me'],
    queryFn: () => getAccount()
  })

  useEffect(() => {
    if (!isLoading && accountData) {
      console.log(accountData)
      const {
        firstName,
        lastName,
        phone,
        email,
        twitter,
        telegram,
        facebook,
        birthday,
        birthPlace,
        jobTitle,
        introduction,
        education
      } = accountData
      setValue('firstName', firstName)
      setValue('lastName', lastName)
      setValue('phone', phone)
      setValue('email', email)
      setValue('twitter', twitter)
      setValue('telegram', telegram)
      setValue('facebook', facebook)
      setValue('birthday', birthday)
      setValue('birthPlace', birthPlace)
      setValue('jobTitle', jobTitle)
      setValue('introduction', introduction)
      setValue('education', education)

      if (accountData.signature) {
        setSignature(accountData.signature)
      }
    }
  }, [accountData, isLoading, setValue])

  const [openSignatureDialog, setOpenSignatureDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const sigCanvas = useRef({})

  const handleAddSignature = () => {
    setOpenSignatureDialog(true)
  }

  const handleClearSignature = () => {
    sigCanvas.current.clear()
  }

  const handleChangePassword = () => {
    setOpenPasswordDialog(true)
  }

  const handleSavePassword = async data => {
    console.log(data)
    try {
      const response = await changePassword({
        data: {
          currentPassword: data.oldPassword,
          newPassword: data.newPassword
        }
      })
      if (response) {
        console.log('Password changed')
        toast.success(t('Password changed successfully'))
        setOpenPasswordDialog(false)
      }
    } catch (error) {
      console.log(t('Error changing password'))
    }
  }

  const handleSaveSignature = async () => {
    const signatureSvg = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/svg+xml')

    try {
      const response = await changeSignature({
        signature: signatureSvg
      })
      setSignature(signatureSvg)
      toast.success(t('Signature added successfully'))
      setOpenSignatureDialog(false)
    } catch (error) {
      toast.error(t('Error adding signature'))
    }
  }

  const handleDeleteSignature = async () => {
    try {
      const response = await changeSignature({
        signature: null
      })
      setSignature(null)
      toast.success(t('Signature deleted successfully'))
      setOpenSignatureDialog(false)
    } catch (error) {
      toast.error(t('Error deleting signature'))
    }
  }

  const onSubmit = async data => {
    try {
      data.id = accountData.id
      const response = await updateAccount(data)
      if (response) {
        console.log('Account updated')
        toast.success(t('Account updated successfully'))
      }
    } catch (error) {
      console.log(t('Error updating account'))
    }
  }

  // if signature is already saved, load it

  if (isLoading) return <FallbackSpinner />

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title={t('User Profile')} />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent className={'w-full'}>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-3'>
            <div>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('firstName')}
                    error={!!errors.firstName}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('phone')}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('email')}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='birthday'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('birthday')}
                    error={!!errors.birthday}
                    type='date'
                    helperText={errors.birthday ? errors.birthday.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='birthPlace'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('Birth Place')}
                    error={!!errors.birthPlace}
                    helperText={errors.birthPlace ? errors.birthPlace.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='twitter'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('Twitter')}
                    error={!!errors.twitter}
                    helperText={errors.twitter ? errors.twitter.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='telegram'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('Telegram')}
                    error={!!errors.telegram}
                    helperText={errors.telegram ? errors.telegram.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='facebook'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('Facebook')}
                    error={!!errors.facebook}
                    helperText={errors.facebook ? errors.facebook.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='jobTitle'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('jobTitle')}
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle ? errors.jobTitle.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='introduction'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('introduction')}
                    error={!!errors.introduction}
                    helperText={errors.introduction ? errors.introduction.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='education'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    fullWidth
                    label={t('Education')}
                    error={!!errors.education}
                    helperText={errors.education ? errors.education.message : ''}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', marginTop: '10px', width: '100%' }}>
            <Button size='medium' variant='outlined' onClick={handleAddSignature}>
              {signature ? t('Change Signature') : t('Add Signature')}
            </Button>
            <Button size='medium' variant='outlined' onClick={handleChangePassword}>
              {t('Change Password')}
            </Button>
            <Button size='medium' variant='contained' type='submit'>
              {t('submit')}
            </Button>
          </Box>
        </CardActions>
      </form>

      <Dialog open={openSignatureDialog} onClose={() => setOpenSignatureDialog(false)}>
        <DialogTitle className='flex justify-between'>
          {signature ? t('Change Signature') : t('Add Signature')}{' '}
          {signature && <img src={signature} alt='signature' className='h-20 w-20 center' />}
        </DialogTitle>
        <DialogContent>
          <SignatureCanvas
            ref={sigCanvas}
            penColor='#4164D0'
            canvasProps={{ width: 500, height: 500, className: 'sigCanvas', color: 'red' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSignatureDialog(false)} color='primary'>
            {t('cancel')}
          </Button>
          <Button onClick={handleClearSignature} color='primary'>
            {t('clear')}
          </Button>
          <Button onClick={() => handleDeleteSignature} color='primary'>
            {t('delete')}
          </Button>
          <Button onClick={handleSaveSignature} color='primary' variant='contained'>
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        fullWidth
        maxWidth='sm'
        aria-labelledby='form-dialog-title'
      >
        <form onSubmit={handleSubmitPassword(handleSavePassword)}>
          <DialogTitle id='form-dialog-title'>{t('Change Password')}</DialogTitle>
          <DialogContent>
            <div className='w-full flex flex-col items-stretch gap-3 sm:gap-3 mt-4'>
              <div>
                <Controller
                  name='oldPassword'
                  control={controlPassword}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant='standard'
                      fullWidth
                      label={t('Old Password')}
                      error={!!errorsPassword.oldPassword}
                      type='password'
                      helperText={errorsPassword.oldPassword ? errorsPassword.oldPassword.message : ''}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name='newPassword'
                  control={controlPassword}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant='standard'
                      fullWidth
                      type='password'
                      label={t('New Password')}
                      error={!!errorsPassword.newPassword}
                      helperText={errorsPassword.newPassword ? errorsPassword.newPassword.message : ''}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name='confirmPassword'
                  control={controlPassword}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant='standard'
                      fullWidth
                      type='password'
                      label={t('Confirm Password')}
                      error={!!errorsPassword.confirmPassword}
                      helperText={errorsPassword.confirmPassword ? errorsPassword.confirmPassword.message : ''}
                    />
                  )}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)} color='primary'>
              {t('Cancel')}
            </Button>
            <Button type='submit' color='primary' variant='contained'>
              {t('Save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default UserProfileForm
