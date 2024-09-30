import { ex } from '@fullcalendar/core/internal-common'
import * as yup from 'yup'

export const schema_file_type = yup.object().shape({
  title: yup.string().required('required_field'),
  frequencyId: yup.string().required('required_field')
})

export const schema_population = yup.object().shape({})
export const schema_file = yup.object().shape({})

export const schema_zone = yup.object().shape({
  name: yup.string().required('required_field'),
  title: yup.string().required('required_field'),
  openingDate: yup.date().required('required_fieldd')
})

export const schema_project = yup.object().shape({
  name: yup.string().required('required_field'),
  description: yup.string().required('required_field')
  
})

export const schema_levels = yup.object().shape({
  title: yup.string().required('required_field'),
  name: yup.string().required('required_field')
})

export const schema_account = yup.object().shape({
  name: yup.string().required('required_field'),
  number: yup.string().required('required_field')
})

export const schema_element = yup.object().shape({
  title: yup.string().required('required_field'),
  editablePrice: yup.boolean().required('required_field'),
  units: yup.string().required('required_field'),
  vartype: yup.string().required('required_field')

  // shortname: yup.string().required('required_field'),
  // formName: yup.string().required('required_field'),
  // dhis2Uid: yup.string().required('required_field'),
  // targetPopulationId: yup.string().required('required_field'),
  // featured: yup.boolean().required('required_field'),
  // useNeedinessBonus: yup.boolean().required('required_field'),
  // realtimeResult: yup.boolean().required('required_field'),
  // useCoverage: yup.boolean().required('required_field'),
  // description: yup.string().required('required_field')
  // iconFile: yup.string().required('required_field')
})

export const schema_role = yup.object().shape({
  name: yup.string().required('required_field'),
  description: yup.string()
})

export const schema_group = yup.object().shape({
  name: yup.string().required('required_field'),
  description: yup.string()
})

export const schema_group_members = yup.object().shape({
  groupId: yup.number().required('required_field'),
  userId: yup.number().required('required_field'),
  startedAt: yup.date().required('required_field'),
  closedAt: yup.date().required('required_field')
  // .when('startedAt', (startedAt, schema) => {
  //   return schema.min(startedAt, 'Closed Date' + ' ' + 'should_be_after_started_at')
  // })
})

export const schema_role_members = yup.object().shape({
  roleId: yup.number().required('required_field'),
  userId: yup.number().required('required_field'),
  startedAt: yup.date().required('required_field'),
  closedAt: yup.date().required('required_field')
  // .when('startedAt', (startedAt, schema) => {
  //   return schema?.min(startedAt, 'Closed Date' + ' ' + 'should_be_after_started_at')
  // })
})

export const schema_element_group = yup.object().shape({
  title: yup.string().required('required_field'),
  featured: yup.boolean().required('required_field'),
  realtimeResult: yup.boolean().required('required_field'),
  sortOrder: yup.number().required('required_field'),
  iconFile: yup.mixed().required('required_field')
})

export const schema_entity_class = yup.object().shape({
  name: yup.string().required('required_field'),
  shortname: yup.string().required('required_field')
})

export const schema_entity_type = yup.object().shape({
  name: yup.string().required('required_field'),
  shortname: yup.string().required('required_field')
})
export const schema_contract_type = yup.object().shape({
  title: yup.string().required('required_field')
})

export const schema_entity = yup.object().shape({
  name: yup.string().required('required_field'),
  entitytypeId: yup.number().required('required_field'),
  entityclassId: yup.number().required('required_field'),
  zoneId: yup.number().required('required_field')
})

export const schema_entity_create = yup.object().shape({
  name: yup.string().required('required_field'),
  entitytypeId: yup.number().required('required_field'),
  entityclassId: yup.number().required('required_field'),
  zoneId: yup.number().required('required_field'),
  zoneStartDate: yup.date().required('required_field'),
  number: yup.string().required('required_field'),
  bankId: yup.number().required('required_field'),
  contactName: yup.string().required('required_field'),
  phoneNumber: yup.number().required('required_field'),
  contractStartDate: yup.date().required('required_field'),
  contracttypeId: yup.number().required('required_field')
})

export const schema_bank = yup.object().shape({
  name: yup.string().required('required_field'),
  title: yup.string().required('required_field')
})

export const schema_contract_action = yup.object().shape({
  startDate: yup.date().required('required_field'),
  contracttypeId: yup.number().required('required_field'),
  accountNumber: yup.string().required('required_field'),
  bankId: yup.string().required('required_field'),
  signatory: yup.string().required('required_field'),
  signatoryFunction: yup.string().required('required_field'),
  contactName: yup.string().required('required_field'),
  phoneNumber: yup.string().required('required_field'),
  resourceFile: yup
    .mixed()
    .required('Required')
    .test(
      'fileSize',
      'le fichier est requis et doit être un fichier pdf , maximum 10Mo',
      value => value && value.size <= 10000000 && value.type === 'application/pdf'
    )
})

export const schema_contract_action_1 = yup.object().shape({
  startDate: yup.date().required('required_field'),
  contracttypeId: yup.number().required('required_field'),
  accountNumber: yup.string().required('required_field'),
  bankId: yup.string().required('required_field'),
  signatory: yup.string().required('required_field'),
  signatoryFunction: yup.string().required('required_field'),
  contactName: yup.string().required('required_field'),
  phoneNumber: yup.string().required('required_field'),
  pricipalContract: yup.number().required('required_field')
})

export const schema_contract_action_2 = yup.object().shape({
  startDate: yup.date().required('required_field'),
  contracttypeId: yup.string().required('required_field'),
  accountNumber: yup.string().required('required_field'),
  bankId: yup.string().required('required_field'),
  signatory: yup.string().required('required_field'),
  signatoryFunction: yup.string().required('required_field'),
  contactName: yup.string().required('required_field'),
  phoneNumber: yup.string().required('required_field')
})

export const schema_post = yup.object().shape({
  title: yup.string().required('required_field')
})

export const schema_contract = yup.object().shape({
  startDate: yup.date().required('required_field'),
  contracttypeId: yup.number().required('crequired_field'),
  contractPath: yup.mixed().required('required_field')
})

export const schema_contract_suspension = yup.object().shape({
  reason: yup.string().required('required_field'),
  startDate: yup.date().required('required_field')
})

export const schema_contact = yup.object().shape({})
export const schema_bank_account = yup.object().shape({})
export const schema_bank_child = yup.object().shape({})
export const schema_permission = yup.object().shape({})
export const schema_user = yup.object().shape({})
export const schema_budget = yup.object().shape({})
export const schema_planification = yup.object().shape({})
export const schema_comleteness = yup.object().shape({})
export const schema_permission_request = yup.object().shape({})
export const schema_rol_members = yup.object().shape({})
export const schema_group_members_lite = yup.object().shape({})
