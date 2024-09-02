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
import { fetchRoles } from 'src/api/access-management/rols'
import { createRoleMember, fetchOneRoleMember, updateRoleMember } from 'src/api/access-management/rols/members'
import { fetchUsers } from 'src/api/access-management/users/users'
import { PERMISSIONS } from 'src/constants'
import { schema_role_members as Schema } from 'src/constants/forms/validationSchemas'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query

  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const {
    data: roleMember,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_user', mode, id],
    queryFn: () => fetchOneRoleMember(parseInt(id)),
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

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await fetchRoles({
        all: true,
        pageNumber: 0,
        pageSize: null
      })

      return res
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
            ...roleMember,
            startedAt: roleMember?.startedAt ? new Date(roleMember?.startedAt) : null,
            closedAt: roleMember?.closedAt ? new Date(roleMember?.closedAt) : null
          }

    return init
  }, [mode, roleMember, router.query])

  const fields: FormField[] = [
    {
      name: 'userId',
      label: 'User',
      type: 'select',
      options: users || []
    },
    {
      name: 'roleId',
      label: 'role',
      type: 'select',
      options: roles?.map((el: any) => ({ value: el.id, label: el.name })) || []
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
        res = await createRoleMember(data)
      } else if (mode === 'edit') {
        res = await updateRoleMember(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res) {
        toast.success(msg)
        router.push('/admin/access-management/role-members')
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
