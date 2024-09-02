'use client'
import React, { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import Input from './Input'
import SelectMui from './Select'
import DateTimePicker from './DateTimePicker'
import { FormField, depsToOptions } from 'src/@core/utils'
import FileInput from './FileInput'
import Textarea from './Textarea'
import { useQuery } from '@tanstack/react-query'
import Checkbox from './checkbox'
import MultiSelect from './MultiSelect'
import { EntitySelector } from './entitiySelector'
import FileBrowswer from './FileBrowser'
import { ContractZones } from './contractZones'
import dynamic from 'next/dynamic'

const CustomEditor = dynamic(() => import('./customEditor'), { ssr: false })

const mapper = {
  text: Input,
  number: Input,
  textarea: Textarea,
  select: SelectMui,
  multiple: MultiSelect,
  datetime: Input,
  file: FileInput,
  checkbox: Checkbox,
  radio: Input,
  textEditor: CustomEditor,
  groupSelect: null,
  email: Input,
  password: Input,
  tel: Input,
  url: Input,
  date: DateTimePicker,
  grouped: MultiSelect,
  entitySelector: EntitySelector,
  FileBrowser: FileBrowswer,
  contractZones: ContractZones
}

function ItemRenderer({ item, readOnly, className = '' }: { item: FormField; readOnly?: boolean; className?: string }) {
  const Component = mapper[item.type]

  const value = useWatch({ name: item.name })

  useEffect(() => {
    if (item?.watcher) {
      item?.watcher(value)
    }
  }, [value, item?.watcher])

  const syncToValue = item.syncTo?.field ? useWatch({ name: item.syncTo?.field }) : null

  const { data: syncToOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: [`syncto${item.syncTo?.field}`, syncToValue],
    queryFn: async () => {
      const newOptions = await item.syncTo?.func(syncToValue)

      const options = item.options?.concat(depsToOptions(newOptions))
      console.log('options', options)

      return options
    },
    enabled: !!syncToValue
  })

  if (!Component || item.hidden) return null

  return (
    <div className={` ${className} ${item.splitFull ? 'col-span-full' : ''}`} key={item.name}>
      <Component
        {...item}
        id={item.name}
        options={item.syncTo?.field && !readOnly ? syncToOptions : item.options}
        isMulti={item.isMulti}
        readOnly={readOnly}
        fileType={item?.fileType}
      />
    </div>
  )
}

export default ItemRenderer
