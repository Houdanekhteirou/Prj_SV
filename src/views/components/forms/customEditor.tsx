'use client'
import JoditEditor from 'jodit-react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const editorConfiguration = {
  readonly: false,
  toolbarButtonSize: 'middle',
  buttons: [
    'source',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'font',
    'fontsize',
    'brush',
    'paragraph',
    '|',
    'image',
    'table',
    'link',
    '|',
    'align',
    'undo',
    'redo',
    '|',
    'hr',
    'eraser',
    'copyformat',
    '|',
    'symbol',
    'fullsize',
    'print'
  ]
}

function CustomEditor({ name, readOnly, label, className }) {
  const { control, setValue, getValues } = useFormContext()

  const { t } = useTranslation()

  if (readOnly)
    return (
      <div className={`${className}`}>
        <label className='block text-sm font-medium text-gray-700'>{t(label)}</label>
        <div className='bg-gray-100 p-2' dangerouslySetInnerHTML={{ __html: getValues(name) }}></div>
      </div>
    )

  return (
    <div className={`${className}`}>
      <label className='block text-sm font-medium text-gray-700'>{t(label)}</label>
      <JoditEditor value={getValues(name)} config={editorConfiguration} onBlur={content => setValue(name, content)} />
    </div>
  )
}

export default CustomEditor
