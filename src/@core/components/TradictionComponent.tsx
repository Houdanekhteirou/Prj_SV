import { TabContext, TabPanel } from '@mui/lab'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { translate } from 'src/api/other'

type Props = {
  isOpen: boolean
  onClose: () => void
  translations: Array<{
    property: string
    lang: 'en' | 'ar'
    value: string
  }>
  fields: any
  elementId: number
  path: string
}

export const TranslationComponentModal = ({ isOpen, onClose, translations, fields, elementId, path }: Props) => {
  const [translationsState, setTranslationsState] = useState({
    en: {},
    ar: {}
  })
  const [value, setValue] = useState('en')
  const { t } = useTranslation()

  useEffect(() => {
    if (translations) {
      const updatedTranslationsState: {
        en: any
        ar: any
      } = {
        en: {},
        ar: {}
      }

      translations.forEach(translation => {
        const { property, lang, value } = translation
        if (updatedTranslationsState[lang]) {
          updatedTranslationsState[lang][property] = value
        }
      })

      setTranslationsState(updatedTranslationsState)
    }
  }, [translations])

  const handleTranslationChange = (language, fieldName, value) => {
    setTranslationsState(prevState => ({
      ...prevState,
      [language]: {
        ...prevState[language],
        [fieldName]: value
      }
    }))
  }

  const handleSubmit = async () => {
    const outputArr = []

    for (const lang in translationsState) {
      for (const property in translationsState[lang]) {
        const value = translationsState[lang][property]
        outputArr.push({
          property: property,
          lang: lang,
          value: value
        })
      }
    }

    // await onSubmit({
    //   elementId,
    //   translations: outputArr
    // })

    try {
      const res = await translate(elementId, outputArr, path)
      if (res.success) {
        toast.success('Translation success')
      } else {
        toast.error('Translation failed')
      }
    } catch (e) {
      toast.error('Translation failed')
    }

    onClose() // Close the modal after submission
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>{t('Translation Modal')}</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Tabs
            value={value}
            indicatorColor='primary'
            textColor='primary'
            onChange={(e, newValue) => setValue(newValue)}
          >
            <Tab label='English' value='en' />
            <Tab label='العربية' value='ar' />
          </Tabs>
          <TabPanel value='en'>
            <div>
              {fields.map(field => (
                <div key={field.name} className='mb-4 flex justify-between w-full'>
                  <TextField
                    multiline
                    key='en'
                    name={`${field.name}-en`}
                    placeholder={field.labels.en}
                    value={translationsState['en'][field.name] || ''}
                    onChange={e => handleTranslationChange('en', field.name, e.target.value)}
                    rowsMin={2}
                  />
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel value='ar'>
            <div dir='rtl'>
              {fields.map(field => (
                <div key={field.name} className='mb-4 flex justify-between w-full'>
                  <TextField
                    multiline
                    key='ar'
                    name={`${field.name}-ar`}
                    placeholder={field.labels.ar}
                    value={translationsState['ar'][field.name] || ''}
                    onChange={e => handleTranslationChange('ar', field.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {t('save')}
        </Button>
        <Button onClick={onClose} variant='outlined'>
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
