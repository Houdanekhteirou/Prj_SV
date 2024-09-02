'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { fileOperations } from 'src/@core/components/FileOperations'
import { fetchGroupes } from 'src/api/access-management/groups'
import { createGroupMember, fetchOneGroupMember, updateGroupMember } from 'src/api/access-management/groups/members'
import { fetchUsers } from 'src/api/access-management/users/users'
import { PERMISSIONS } from 'src/constants'
import { schema_group_members as Schema } from 'src/constants/forms/validationSchemas'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query

  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const {
    data: groupMember,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_user', mode, id],
    queryFn: () => fetchOneGroupMember(parseInt(id)),
    enabled: !!id
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetchUsers({
        all: true
      })

      // return label value array
      return res.data.map((el: any) => ({ value: el.id, label: el.fullName }))
    }
  })

  const { data: groups, isLoading: isGroupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await fetchGroupes({
        all: true,
        pageNumber: 0,
        pageSize: null
      })

      return res.data
    }
  })

  const initialValues = useMemo(() => {
    const user = typeof router.query.userId === 'string' ? parseInt(router.query.userId) : null
    const init =
      mode === 'create'
        ? {
            userId: user
          }
        : {
            ...groupMember,
            startedAt: groupMember?.startedAt ? new Date(groupMember?.startedAt) : null,
            closedAt: groupMember?.closedAt ? new Date(groupMember?.closedAt) : null
          }

    return init
  }, [mode, groupMember, router.query])

  const fields: FormField[] = [
    {
      name: 'userId',
      label: 'User',
      type: 'select',
      options: users || []
    },
    {
      name: 'groupId',
      label: 'group',
      type: 'select',
      options: groups?.map((el: any) => ({ value: el.id, label: el.name })) || []
    },
    {
      name: 'startedAt',
      label: 'Start Date',
      type: 'date'
    },
    {
      name: 'closedAt',
      label: 'End Date',
      type: 'date'
    }
  ]

  const action = useCallback(
    async (data: any) => {
      let res
      if (mode === 'create') {
        res = await createGroupMember(data)
      } else if (mode === 'edit') {
        res = await updateGroupMember(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res) {
        toast.success(msg)
        router.push('/admin/access-management/group-members')
      } else {
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
    },
    [id]
  )

  if (isLoading && mode === 'edit') return <FallbackSpinner />
  if (!initialValues.userId && !router.isReady) return <FallbackSpinner />

  return (
    <div className='section animate-fadeIn'>
      <div>
        <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
          <FormRenderer
            readOnly={mode === 'view'}
            fields={fields}
            validationSchema={Schema}
            initialValues={initialValues}
            onSubmit={action}
            title={mode === 'view' ? t('View') : mode === 'edit' ? t('Edit') : t('Add')}
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.Gestion_acces.write, PERMISSIONS.Gestion_acces.update]
export default Form
