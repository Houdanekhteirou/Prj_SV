import { id } from 'date-fns/locale'

export const col_file_type = [
  { id: 'id', name: 'id' },
  { id: 'title', name: 'title' },
  { id: 'uid', name: 'Title Pub' },
  { id: 'frequency', name: 'frequency' },
  { id: 'template', name: 'template' }
]

export const col_population = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'Name' },
  { id: 'percentage', name: 'percentage' }
]

export const col_file = [
  { id: 'id', name: 'id' },
  { id: 'entity', name: 'entity' },

  // { id: 'totalValue', name: 'totalValue', format: true },
  { id: 'filetype', name: 'fileType' },
  { id: 'month', name: 'month' },
  { id: 'year', name: 'year' },
  { id: 'author', name: 'Author' },
  { id: 'status', name: 'status' },
  { id: 'createdAt', name: 'creationDate' },
  { id: 'updatedAt', name: 'updated_at' }
]

export const col_zone = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'name' },
  { id: 'populationCount', name: 'Population Count' },
  { id: 'populationYear', name: 'Population Year' },
  { id: 'openingDate', name: 'Opening Date' },
  { id: 'closedDate', name: 'Closed Date' },
  { id: 'parentId', name: 'Parent Id' },
  { id: 'levelId', name: 'Level Id' }
]
export const col_levels = [
  { id: 'id', name: 'id' },
  { id: 'title', name: 'title' },
  { id: 'level', name: 'Level' }
]
export const col_element = [
  { id: 'id', name: 'id' },
  { id: 'image', name: 'image' },
  { id: 'title', name: 'title' },
  { id: 'shortname', name: 'shortname' },
  { id: 'units', name: 'units' },
  { id: 'vartype', name: 'vartype' }
]

export const col_role = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'Name' },
  { id: 'description', name: 'description' }
]

export const col_group = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'Name' },
  { id: 'description', name: 'description' },
  { id: 'usersCount', name: 'usersCount' }
]

export const col_group_members = [
  { id: 'id', name: 'id' },
  { id: 'groupName', name: 'groupName' },
  { id: 'userName', name: 'user' },
  { id: 'startedAt', name: 'startedAt' },
  { id: 'closedAt', name: 'closedAt' },
  { id: 'status', name: 'status' }
]

export const col_rol_members = [
  { id: 'id', name: 'id' },
  { id: 'roleName', name: 'roleName' },
  { id: 'userName', name: 'user' },
  { id: 'startedAt', name: 'startedAt' },
  { id: 'closedAt', name: 'closedAt' }
  // { id: 'status', name: 'status' }
]

export const col_rol_members_lite = [
  { id: 'roleName', name: 'roleName' },
  { id: 'startedAt', name: 'startedAt' },
  { id: 'closedAt', name: 'closedAt' }
]

export const col_group_members_lite = [
  { id: 'groupName', name: 'groupName' },
  { id: 'startedAt', name: 'startedAt' },
  { id: 'closedAt', name: 'closedAt' }
]
export const col_element_group = [
  { id: 'id', name: 'id' },
  { id: 'iconFile', name: 'icone', img: true },
  { id: 'title', name: 'title' },

  { id: 'sortOrder', name: 'ordre de tri' },
  { id: 'realtimeResult', name: 'résultat en temps réel' }
]

export const col_contractType = [
  { id: 'id', name: 'id' },
  { id: 'title', name: 'Title' },
  { id: 'duration', name: 'duration' },
  { id: 'authority', name: 'authority' },
  { id: 'division', name: 'division' },
  { id: 'renewable', name: 'renewable' }
]

export const col_account = [
  { id: 'id', name: 'id' },
  { id: 'entity', name: 'entity' },
  { id: 'number', name: 'number' },
  { id: 'bank', name: 'BANK' },
  { id: 'agence', name: 'agence' }
]

export const col_entity_class = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'Name' }
]

export const col_entity_type = [
  { id: 'id', name: 'id' },
  { id: 'image', name: 'image' },
  { id: 'name', name: 'Name' },
  { id: 'shortname', name: 'shortname' }
]

export const col_entity = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'Name' },
  { id: 'zone', name: 'zone' },
  { id: 'entitytype', name: 'entityType' }
]

export const col_bank = [{ id: 'name', name: 'name' }]
export const col_budget = [
  { id: 'id', name: 'id' },
  { id: 'region', name: 'region' },
  { id: 'entityType', name: 'entityType' },
  { id: 'entity', name: 'entity' },
  { id: 'year', name: 'year' },
  { id: 'amount', name: 'amount' }
]
export const col_planification = [
  { id: 'id', name: 'id' },
  { id: 'entity', name: 'entity' },
  { id: 'quarter', name: 'trimestre' },
  { id: 'year', name: 'year' }
]
export const col_comleteness = [
  { id: 'id', name: 'id' },
  { id: 'title', name: 'title' },
  { id: 'description', name: 'description' }
]
export const col_permission_request = [
  { id: 'userId', name: 'user' },
  { id: 'creationDate', name: 'creationDate' },
  { id: 'status', name: 'status' }
]
export const col_post = [
  { id: 'id', name: 'id' },
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'published', name: 'Publie', check: true },
  { id: 'archived', name: "Page d'accueill", square: true }

  // Add other columns as needed based on your API response
]
export const CsubEl = [
  { id: 'orderNumber', name: 'orderNumber' },
  { id: 'filetype_name', name: 'title' },
  { id: 'price', name: 'price' },
  { id: 'bonus', name: 'bonus' },
  { id: 'openingDate', name: 'Opening Date' },
  { id: 'closedDate', name: 'Closed Date' }
]
export const CsubEl1 = [
  { id: 'orderNumber', name: 'orderNumber' },
  { id: 'element_name', name: 'title' },
  { id: 'price', name: 'price' },
  { id: 'bonus', name: 'bonus' },
  { id: 'openingDate', name: 'Opening Date' },
  { id: 'closedDate', name: 'Closed Date' }
]
export const col_contract = [
  { id: 'number', name: 'code' },
  { id: 'entity', name: 'entity' },
  { id: 'entityType', name: 'entityType' },
  { id: 'contractType', name: 'contractType' },
  { id: 'startDate', name: 'debut' },
  { id: 'endDate', name: 'fin' },
  { id: 'status', name: 'status' }
]

export const col_report_type = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'name' },
  { id: 'description', name: 'description' }
]

export const col_contact = [
  { id: 'name', name: 'Name' },
  { id: 'phoneNumber', name: 'Phone Number' }
]

export const col_bank_account = [
  { id: 'bank', name: 'Bank' },
  { id: 'number', name: 'numero' }
]
export const col_bank_child = [
  { id: 'id', name: 'id' },
  { id: 'name', name: 'name' }
]
export const col_permission = [
  { id: 'id', name: 'id' },
  { id: 'title', name: 'title' },
  { id: 'description', name: 'description' }
]
export const col_user = [
  { id: 'id', name: 'id' },
  { id: 'fullName', name: 'name' },
  { id: 'email', name: 'Email' },
  { id: 'jobtitle', name: 'fonction' },
  { id: 'phone', name: 'telephone' }
]

export const col_report = [
  { id: 'name', name: 'Nom' },
  { id: 'date', name: 'Date' },
  { id: 'reporttype', name: 'Type' },
  { id: 'totalQtty', name: 'totalQtty' },
  { id: 'totalQlty', name: 'totalQlty' },
  { id: 'total', name: 'total' }
]
