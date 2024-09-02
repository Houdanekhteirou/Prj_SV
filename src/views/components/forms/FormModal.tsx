'use client'
import { Fragment, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '../Button'
import ItemRenderer from './ItemRenderer'
import SubmitButton from './SubmitButton'
import NotFound from '../404'
import { useQuery } from '@tanstack/react-query'
import { FormField } from '@/types'

type Props = {
  title: string
  fields: Array<FormField>
  schema: any
  visible: boolean
  handleClose: () => void
  onSubmit: (data: any) => void
  readOnly?: boolean
  initialValues: any
}

const FormModal = ({
  title,
  fields,
  schema,
  visible,
  handleClose,
  onSubmit,
  initialValues,
  readOnly = false
}: Props) => {
  const theInitialValues = useMemo(() => {
    const newObj = { ...initialValues }
    delete newObj.id

    return newObj
  }, [initialValues])

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: theInitialValues
  })

  return (
    <Transition show={visible} as={Fragment}>
      <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={handleClose}>
        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
            {/* &#8203; */}
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='relative inline-block align-middle mx-auto bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-xl w-full sm:p-6'>
              <div className='mb-4'>
                <Dialog.Title className='text-lg font-bold'>{title}</Dialog.Title>
                <button className='absolute top-2 right-2 p-2' onClick={handleClose}>
                  <span className='sr-only'>Close</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              <FormProvider {...methods}>
                <div className='flex flex-col gap-4'>
                  {fields.map(field => {
                    return <ItemRenderer key={field.name} item={field} readOnly={readOnly} />
                  })}
                </div>
                <div className='flex justify-end gap-6 mt-8'>
                  <Button type='button' variant='outline' onClick={handleClose}>
                    Cancel
                  </Button>
                  <SubmitButton onSubmit={methods.handleSubmit(onSubmit)} disabled={methods.formState.isSubmitting} />
                </div>
              </FormProvider>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default FormModal
