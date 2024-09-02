import { AbilityBuilder, Ability } from '@casl/ability'
import { PERMISSIONS } from 'src/constants'

export type Subjects = keyof typeof PERMISSIONS
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

const defineRulesFor = (role: string, subject: Subjects) => {
  const { can, rules } = new AbilityBuilder<AppAbility>()
  const permissions = PERMISSIONS[subject]
  if (permissions) {
    Object.keys(permissions).forEach(action => {
      can(action as Actions, subject)
    })
  }

  return rules
}

export const buildAbilityFor = (role: string, subject: Subjects): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
