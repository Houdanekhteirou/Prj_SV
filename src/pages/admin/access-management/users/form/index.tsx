'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, depsToOptions } from 'src/@core/utils'
import { changePassword, createUser, fetchOneUser, updateUser } from 'src/api/access-management/users/users'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

import { fileOperations } from 'src/@core/components/FileOperations'
import { UserRoles } from 'src/@core/components/userRoles'
import { PERMISSIONS } from 'src/constants'
import FallbackError from 'src/@core/components/error'
import { fetchRoles } from 'src/api/access-management/rols'
import { fetchGroupes } from 'src/api/access-management/groups'
import { group } from 'console'
import { UserGroups } from 'src/@core/components/userGroups'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit', 'editpassword'].includes(mode)) {
    mode = 'create'
  }

  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['org_user', mode, id],
    queryFn: () => fetchOneUser(parseInt(id)),
    enabled: !!id
  })

  const {
    data: allZones,
    isLoading: isLoadingZones,
    error: errorZones
  } = useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const res = await fetchZonesByLevel(4)
      const a = res.map(el => {
        const b = el.initial_zones.map(e => {
          return { label: e.name, value: e.id, group: el.name }
        })
        return b
      })

      return a.flat()
    }
  })

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles({})
  })

  const { data: groupes, isLoading: isGroupesLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await fetchGroupes({
        all: true
      })
      return res.data
    }
  })

  const initialValues = useMemo(
    () =>
      mode === 'create'
        ? {
            // group start date and role start date set to current date
            roleStartedAt: new Date(),
            groupStartedAt: new Date()
          }
        : user,
    [mode, user]
  )

  const fields: FormField[] = [
    {
      name: 'fullName',
      label: 'Name',
      type: 'text',
      className: 'col-span-2',
      groupKey: 4
    },
    {
      name: 'jobtitle',
      label: 'fonction',
      type: 'text',
      className: 'col-span-2',
      groupKey: 4
    },
    {
      name: 'phone',
      label: 'telephone',
      type: 'number',
      className: 'col-span-2',
      groupKey: 4
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      className: 'col-span-2',
      groupKey: 4
    },

    {
      name: 'zones',
      label: 'Zone Sanitaire',
      type: 'multiple',
      className: 'w-full col-span-full',
      options: allZones || [],
      isMulti: true
    }
  ]

  const extraFields: FormField[] = [
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      options: depsToOptions(roles),
      groupKey: 1,
      className: 'col-span-full'
    },
    {
      name: 'roleStartedAt',
      type: 'date',
      label: 'Started At',
      groupKey: 1,
      className: 'col-span-2'
    },
    {
      name: 'roleClosedAt',
      type: 'date',
      label: 'Closed Date',
      groupKey: 1,
      className: 'col-span-2'
    },
    {
      name: 'groupId',
      label: 'Group',
      type: 'select',
      options: depsToOptions(groupes),
      groupKey: 2,
      className: 'col-span-full'
    },
    {
      name: 'groupStartedAt',
      type: 'date',
      label: 'Started At',
      groupKey: 2,
      className: 'col-span-2'
    },
    {
      name: 'groupClosedAt',
      type: 'date',
      label: 'Closed Date',
      groupKey: 2,
      className: 'col-span-2'
    }
  ]

  const groupFields = [
    {
      name: 'personal',
      id: 4
    },
    {
      name: 'role',
      id: 1
    },
    {
      name: 'group',
      id: 2
    },
    {
      name: 'password',
      id: 3
    }
  ]

  // if the mode is create, we add the password field and confirm password field
  if (mode === 'create') {
    fields.push(
      {
        name: 'pass',
        label: 'Password',
        type: 'password',
        className: 'col-span-2',
        groupKey: 3
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        className: 'col-span-2',
        groupKey: 3
      }
    )
  }

  const createSchema = yup.object().shape({
    fullName: yup.string().required(),
    jobtitle: yup.string(), // jobtitle
    // phone minimum 8 digits and maximum 8 digits and can start only with 2,3,4
    phone: yup
      .string()
      .required()
      .matches(/^[2-4]\d{7}$/, 'Phone number must start with 2, 3 or 4 and must be 8 digits long'),
    email: yup.string().email(),
    pass: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('pass')], 'Passwords must match'),
    roleId: yup.number().required(),
    roleStartedAt: yup.date().required(),
    // roleClosedAt: yup.date().required(),
    groupId: yup.number().required(),
    groupStartedAt: yup.date().required()
    // groupClosedAt: yup.date().required()
  })
  const editSchema = yup.object().shape({
    fullName: yup.string().required(),
    jobtitle: yup.string(), // jobtitle
    phone: yup
      .string()
      .required()
      .matches(/^[2-4]\d{7}$/, 'Phone number must start with 2, 3 or 4 and must be 8 digits long'),
    email: yup.string().email()
  })

  const changePasswordFields: FormField[] = [
    {
      name: 'old',
      label: 'Old Password',
      type: 'password'
    },
    {
      name: 'new',
      label: 'New Password',
      type: 'password'
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password'
    }
  ]

  const changePasswordSchema = yup.object().shape({
    old: yup.string().required('Old Password is required'),
    new: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('new')], 'Passwords must match')
  })

  // console log the errors in the form

  const action = useCallback(
    async (data: any) => {
      console.log('data', data)
      // return
      delete data.wilayaId

      delete data.moughataaId
      data.zones = data?.zones ? data?.zones.map(el => parseInt(el)) : []
      data.activated = data.activated ? 1 : 0
      data.published = data.published ? 1 : 0
      let user
      if (mode === 'create') {
        user = {
          ...data,
          role: {
            roleId: data.roleId,
            startedAt: data.roleStartedAt,
            closedAt: data.roleClosedAt
          },
          group: {
            groupId: data.groupId,
            startedAt: data.groupStartedAt,
            closedAt: data.groupClosedAt
          }
        }
      }
      console.log('user', user)

      // return

      let res

      if (mode === 'create') {
        res = await createUser(user)
      } else if (mode === 'edit') {
        res = await updateUser(Number(id), data)
      } else if (mode === 'editpassword') {
        res = await changePassword({
          userId: Number(id),
          data: { currentPassword: data.old, newPassword: data.new }
        })
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res) {
        toast.success(msg)
        router.push('/admin/access-management/users')
      } else {
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    [id]
  )

  if ((mode == 'view' || mode === 'edit' || mode === 'editpassword') && isLoading) return <FallbackSpinner />
  if (isError || (mode !== 'create' && !initialValues)) return <FallbackError />

  return (
    <div className='section animate-fadeIn'>
      <div>
        <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
          <FormRenderer
            readOnly={mode === 'view'}
            fields={mode === 'editpassword' ? changePasswordFields : fields}
            validationSchema={
              mode === 'create'
                ? createSchema
                : mode === 'edit'
                ? editSchema
                : mode === 'editpassword'
                ? changePasswordSchema
                : createSchema
            }
            initialValues={initialValues}
            groups={groupFields}
            extraFields={mode === 'create' && extraFields}
            onSubmit={action}
            title={
              mode === 'view'
                ? t('View user')
                : mode === 'edit'
                ? t('Edit user')
                : mode === 'editpassword'
                ? t('Edit password')
                : t('Add user')
            }
            extraComponent={
              ['edit', 'view'].includes(mode) && (
                <div className='flex flex-col gap-4'>
                  <UserGroups userId={id} />
                  <UserRoles userId={id} />
                </div>
              )
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.Gestion_acces.write, PERMISSIONS.Gestion_acces.update]
export default Form
