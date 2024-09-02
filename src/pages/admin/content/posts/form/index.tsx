// pages/[...slug]/post.tsx
'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField } from 'src/@core/utils'
import { createPost, fetchOnePost, updatePost } from 'src/api/posts/posts'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { schema_post as schema } from 'src/constants/forms/validationSchemas'
import { fileOperations } from 'src/@core/components/FileOperations'
import { PERMISSIONS, posts_options } from 'src/configs/constant'
import { repoEnum } from 'src/constants'

const fields: FormField[] = [
  {
    name: 'title',
    type: 'text',
    label: 'Title',
    className: 'col-span-2'
  },
  {
    name: 'options',
    type: 'select',
    label: 'Type',
    options: posts_options,
    className: 'col-span-2'
  },
  {
    name: 'content',
    type: 'textEditor',
    label: 'Content',
    className: 'col-span-full'
  },
  {
    name: 'author',
    type: 'text',
    label: 'author',
    className: 'col-span-2'
  },
  {
    name: 'authorFunction',
    type: 'text',
    label: 'authorFunction',
    className: 'col-span-2'
  },
  {
    name: 'resourceId',
    type: 'FileBrowser',
    label: 'image/file',
    repoTitle: repoEnum.POSTS,
    accept: 'image/*'
  },
  {
    name: 'published',
    type: 'checkbox',
    label: 'Publie'
  },
  {
    name: 'archived',
    type: 'checkbox',
    label: "Page d'accueill"
  }
]

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_post', mode, id],
    queryFn: () => fetchOnePost(Number(id)),
    enabled: !!id
  })

  const initialValues = useMemo(() => {
    if (mode === 'create') {
      return {} // Empty object for create mode
    } else if (post && (mode === 'edit' || mode === 'view')) {
      return {
        title: post.title || '',
        content: post.content || '',
        resourceId: post.resourceId || '',
        published: post.published,
        archived: post.archived,
        options: post.options,
        author: post.author,
        authorFunction: post.authorFunction

        // Set other fields as needed
      }
    }

    return {}
  }, [mode, post])

  const action = useCallback(
    async data => {
      let res
      data.published = data.published ? 1 : 0
      data.archived = data.archived ? 1 : 0

      if (mode === 'create') {
        res = await createPost(data)
      } else {
        res = await updatePost(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res) {
        toast.success(msg)
        router.back()
      } else {
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    [id]
  )

  if (isLoading) return <FallbackSpinner />

  return (
    <div className='section animate-fadeIn'>
      <div>
        <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
          <FormRenderer
            readOnly={mode === 'view'}
            fields={fields}
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={action}
            title={mode === 'view' ? t('View news') : mode === 'edit' ? t('Edit news') : t('Add news')}
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.cms.write, PERMISSIONS.cms.update]
export default Form
