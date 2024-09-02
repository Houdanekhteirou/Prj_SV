'use client'

import { useTranslation } from 'react-i18next'
import { DragEventHandler, useRef } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import Label from './Label'
import FilePreview from 'src/@core/components/file-previw/Preview'

type Props = {
  name: string
  label: string
  fileType: string
  readOnly?: boolean
}

const FileInput = ({ name, label, fileType, readOnly }: Props) => {
  const { control, setValue, getValues } = useFormContext()
  const fileValue = useWatch({ name }) as File
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !['image/jpeg', 'image/png', 'application/pdf', 'image/svg+xml'].includes(file.type)) {
      setValue(name, '')

      return
    }
    setValue(name, file)
  }

  const handleDrop: DragEventHandler<HTMLInputElement> = event => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      setValue(name, droppedFile)
    }
  }

  if (readOnly) {
    return (
      <div className='flex flex-col gap-2'>
        <Label id={name}>{t(label)}</Label>
        {
          {
            img: fileValue ? (
              <img src={`${process.env.NEXT_PUBLIC_API_URP}/${fileValue}`} alt={label} height={100} width={200} />
            ) : (
              <img src='/placeholder.jpg' alt='placeholder' />
            ),
            file: getValues(name) ? <FilePreview id={getValues(name)} /> : t('not_seted'),
            all: getValues(name) ? <FilePreview id={getValues(name)} /> : t('not_seted')
          }[fileType]
        }
      </div>
    )
  }

  return (
    <Controller
      name={name}
      defaultValue=''
      control={control}
      render={({ fieldState: { error } }) => (
        <div className='h-full'>
          <Label>{t(label)}</Label>
          <div
            className={`flex rounded-lg border border-dashed h-full leading-8 ${
              error ? 'border-red-500' : 'border-gray-900/25'
            }`}
          >
            <label
              htmlFor={name}
              className='  cursor-pointer rounded-md bg-white font-semibold h-full w-full justify-center flex flex-col items-center gap-1 p-2 text-center'
            >
              {fileValue ? (
                fileType === 'img' ? (
                  <img
                    src={
                      typeof fileValue === 'string'
                        ? `${process.env.NEXT_PUBLIC_API_URP}/${fileValue}`
                        : fileValue instanceof File
                        ? URL.createObjectURL(fileValue)
                        : undefined
                      // : URL.createObjectURL(fileValue)
                    }
                    alt={fileValue.name}
                    className='h-24 w-24'
                  />
                ) : (
                  <a
                    href={
                      typeof fileValue === 'string'
                        ? `${process.env.NEXT_PUBLIC_API_URP}/${fileValue}`
                        : fileValue instanceof File
                        ? URL.createObjectURL(fileValue)
                        : undefined
                      // : URL.createObjectURL(fileValue)
                    }
                    target='_blank'
                    rel='noreferrer'
                  >
                    {typeof fileValue === 'string' ? fileValue : fileValue.name}
                  </a>
                )
              ) : (
                <IconifyIcon
                  className='h-14 w-14'
                  icon={fileType === 'img' ? 'mdi:file-image-outline' : 'mdi:file-document-outline'}
                />
              )}
              <div className='flex flex-col'>
                <span>
                  {fileValue
                    ? `${t('change')} ${t(fileType === 'img' ? 'photo' : 'file')}`
                    : `${t('add')} ${t(fileType === 'img' ? 'photo' : 'file')}`}
                </span>
                <span className='text-xs'>
                  {
                    {
                      img: 'jpeg,png,svg',
                      file: 'pdf'
                    }[fileType]
                  }
                </span>
                (2MB-128MB)
              </div>

              <input
                id={name}
                type='file'
                className='sr-only'
                ref={inputRef}
                onChange={handleFileChange}
                accept={getFileTypeAccept(fileType)}
                onDrop={handleDrop}
                onDragOver={event => event.preventDefault()}
              />
            </label>
          </div>
          {error && <p className='text-red-500 mt-0.5 text-sm'>{t(error.message)}</p>}
        </div>
      )}
    />
  )
}

const getFileTypeAccept = fileType => {
  switch (fileType) {
    case 'img':
      return 'image/*, image/svg+xml'
    case 'file':
      return 'application/pdf'
    default:
      return '*'
  }
}

export default FileInput
