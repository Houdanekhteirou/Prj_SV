// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import SpaceDimension from './SpaceDimension'
import TimeDimension from './TimeDimension'
import { CardHeader } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IndicatorsDimension from './IndicatorDimension'

const steps = [
  {
    title: 'Dimenssion Temps',
    subtitle: 'Selectionnez les dimensions du temps'
  },
  {
    title: 'Dimenssion Space',
    subtitle: "Selectionnez les dimensions de l'espace"
  },
  {
    title: 'Dimenssion Indicateur',
    subtitle: "Selectionnez les dimensions de l'indicateur"
  }
]

const ChartsStepper = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [step1, setStep1] = useState<any>({})
  const [step2, setStep2] = useState<any>({})
  const [step3, setStep3] = useState<any>({})
  const { t } = useTranslation()

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onSubmit = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TimeDimension
            title={steps[0].title}
            subtitle={steps[0].subtitle}
            handleBack={handleBack}
            handleNext={onSubmit}
            setStep1={setStep1}
          />
        )
      case 1:
        return (
          <SpaceDimension
            title={steps[1].title}
            subtitle={steps[1].subtitle}
            handleBack={handleBack}
            handleNext={onSubmit}
            setStep2={setStep2}
          />
        )
      case 2:
        return (
          <Fragment>
            <Typography>Indicateur</Typography>
          </Fragment>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained'>
              {t('Reset')}
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardHeader title={t('Charts depending on the dimensions of (time,space,indicators)')} />
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps: {
                error?: boolean
              } = {}

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{t(step.title)}</Typography>
                        <Typography className='step-subtitle'>{t(step.subtitle)}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default ChartsStepper
