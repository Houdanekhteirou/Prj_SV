import { yupResolver } from '@hookform/resolvers/yup'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import { ReactNode, useState } from 'react'
import * as yup from 'yup'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const schema = yup.object().shape({
  name: yup.string().min(4).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm password is required'),
  role_id: yup.string().required()
})

const defaultValues = {
  name: '',
  email: '',
  password: '',
  role_id: '1'
}

interface FormData {
  name: string
  email: string
  password: string
  role_id: string
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const { t } = useTranslation()
  const auth = useAuth()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { name, email, password } = data
    setIsSubmitting(true)
    console.log('process.env.NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URP)

    auth.register({ name, email, password, role_id: 1 }, () => {
      setError('name', {
        type: 'manual',
        message: 'Registration failed, please try again.'
      })
      setIsSubmitting(false)

      toast.success('Registration successful')
    })
  }

  return (
    <Box className='content-center h-full pt-20'>
      <BoxWrapper>
        <Box sx={{ mb: 6 }}>
          <TypographyStyled variant='h5'>{t('Register')}</TypographyStyled>
        </Box>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  label={t('name')}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                  placeholder=''
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{t(errors.name.message)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  label={t('Email')}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  placeholder=''
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{t(errors.email.message)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel htmlFor='auth-register-password' error={Boolean(errors.password)}>
              {t('Password')}
            </InputLabel>
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <OutlinedInput
                  value={value}
                  onBlur={onBlur}
                  label={t('Password')}
                  onChange={onChange}
                  id='auth-register-password'
                  error={Boolean(errors.password)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ color: 'error.main' }}>{t(errors.password.message)}</FormHelperText>
            )}
          </FormControl>

          {/* <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel htmlFor='auth-register-confirm-password' error={Boolean(errors.confirmPassword)}>
              {t('Confirm Password')}
            </InputLabel>
            <Controller
              name='confirmPassword'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <OutlinedInput
                  value={value}
                  onBlur={onBlur}
                  label={t('Confirm Password')}
                  onChange={onChange}
                  id='auth-register-confirm-password'
                  error={Boolean(errors.confirmPassword)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Icon icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.confirmPassword && (
              <FormHelperText sx={{ color: 'error.main' }}>{t(errors.confirmPassword.message)}</FormHelperText>
            )}
          </FormControl> */}

          <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }} disabled={isSubmitting}>
            {t('Register')}
          </Button>
        </form>
      </BoxWrapper>
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterPage.guestGuard = true

export default RegisterPage
