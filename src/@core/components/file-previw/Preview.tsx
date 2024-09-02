import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import ar_AE from '@react-pdf-viewer/locales/lib/ar_AE.json'
import fr_FR from '@react-pdf-viewer/locales/lib/fr_FR.json'
import React, { useMemo } from 'react'
import authConfig from 'src/configs/auth'

import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getPath } from 'src/constants'
import IconifyIcon from '../icon'

const FilePreview = ({ id }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const [open, setOpen] = React.useState(false)

  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  const localization = useMemo(() => {
    switch (locale) {
      case 'fr':
        return fr_FR
      case 'ar':
        return ar_AE
      default:
        return {}
    }
  }, [locale])

  const httpHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`
    }),
    [token]
  )

  if (!id) return null
  if (!open)
    return (
      <div>
        <Button
          onClick={e => {
            e.preventDefault()
            setOpen(true)
          }}
          variant='contained'
        >
          {t('Ouvrir le document')} <IconifyIcon icon='bi:file-earmark-text' />
        </Button>
      </div>
    )

  return (
    <div className='flex flex-col gap-4 '>
      <div>
        <Button
          onClick={e => {
            e.preventDefault()
            setOpen(false)
          }}
          variant='contained'
        >
          {t('Fermer le document')} <IconifyIcon icon='bi:file-earmark-text' />
        </Button>
      </div>
      <Worker workerUrl={process.env.NEXT_PUBLIC_PDFJS_WORKER_URL}>
        <div
          style={{
            height: '1000px',
            width: '800px'
          }}
        >
          <Viewer
            fileUrl={getPath(id)}
            plugins={[defaultLayoutPluginInstance]}
            localization={localization}
            httpHeaders={httpHeaders}
          />{' '}
        </div>
      </Worker>
    </div>
  )
}

export default FilePreview
