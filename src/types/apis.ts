export type GeoJSON = number[][]

export type ApiTranslation = {
  property: string
  lang: string
  value: string
}

// ===%START: Data =========
export type File = {
  id: number
  day: number
  week: number
  month: number
  year: number
  quarter: number
  half: any
  description: any
  fileUpload: any
  totalValue: number
  correctedTotalValue: number | null
  entityId: number
  entity: Entity
  filetypeId: number
  fileType: FileType
  file_elements: FileElement[]
  createdAt: string
  updatedAt: string
}

export type FileType = {
  id: 8
  name: string
  title: string
  elements: Element[]
  frequencyId: number
  frequency: Frequency
  template: 'qlty_evaluation' | 'qtty_evaluation'
  dhis2Uid: string
  [key: string]: any
}

export type FileElement = {
  id: number
  declaredValue: number
  verifiedValue: number
  validatedValue: number
  price: number
  amount: number
  fileId: number // File
  elementId: number // Element
  element: Element
  createdAt: string
  dhis2Uid: string
}

export type Frequency = {
  id: number
  name: string
  title: string
  months: string
}

export type Element = {
  id: number
  orderNumber?: number
  name: string
  title: string
  description: string
  translations: ApiTranslation[]
  dhis2Uid: string
  createdAt: string
  updatedAt: string
  iconFile: string
}

// ===%START: Organization ==========
export type Zone = {
  id: number
  name: string
  title: string
  populationCount: string
  populationYear: string
  geojson: GeoJSON
  openingDate: string
  closedDate: string | null
  parentId: number // Zone parent
  levelId: number // Level
  createdAt: string
  updatedAt: string
  [key: string]: any
}

export type Level = {
  id: number
  name: string
  title: string
  level: 1 | 2 | 3 | 4
  createdAt: string
  updatedAt: string

  [key: string]: any
}

export type EntityType = {
  id: number
  name: string
  title: string
  createdAt: string
  [key: string]: any
}

export type EntityClasse = {
  id: number
  name: string
  shortname: string
  createdAt: string
  [key: string]: any
}

// %END ================================

// ===%START: Entity====================
export type Entity = {
  id: number
  name: string
  geoStatus: string
  staffSize: number
  population: number
  populationYear: number
  contactPerson: string
  bankAccount: string
  coordinateLong: number
  coordinateLat: number
  zoneId: number // Zone
  zone?: Zone
  entitytypeId: number // Enity type
  entityclassId: number // Entity classe
  groupId: number
  bankId: number
  bank: Bank
  populationId: number
  initial_zone: Zone
  contacts: Array<Contact>
  contracts: Array<Contract>
  populations: Population
  createdAt: string
  dhis2: string
  picturePath?: string
}

export type Donor = {
  id: number
  uid: string
  name: string
  shortname: string
  title: string
  logoPath: string
  siteUrl: string
  contactEmail: string
  contactPerson: string
  lang: string
  logoId: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdbyId: number
  updatedbyId: number
  deletedbyId: number
  translations_origine: string
  translations: {
    property: string
    lang: string
    value: string
  }[]
}

export type Bank = {
  id: number
  uid: string
  name: string
  shortname: string
  title: string
  lang: string
  openingDate: string
  closedDate: string
  parentId: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdbyId: number
  updatedbyId: number
  deletedbyId: number
  translations_origine: string
  translations: {
    property: string
    lang: string
    value: string
  }[]
}

export type ElementGroups = {
  id: number
  uid: string
  code: string
  name: string
  shortname: string
  title: string
  sortOrder: number
  featured: number
  realtimeResult: number
  iconFile: string
  description: string
  lang: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  imageId: number
  createdbyId: number
  updatedbyId: number
  deletedbyId: number
  dhis2Uid: string
  dhis2Id: number
  translations_origine: string
  translations: {
    property: string
    lang: string
    value: string
  }[]
}

export type Population = {
  id: number
  count: number
  year: number
  createdAt: string
  zoneId: 77
}

export type PopulationCible = {
  id: number
  name: string
  lang: string
  title: string
  percentage: string
  published: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdbyId: number
  updatedbyId: number
  deletedbyId: number
  translations_origine: string
  translations: {
    property: string
    lang: string
    value: string
  }[]
}

export type Contact = {
  id: number
  name: string
  phoneNumber: string
  email: string
  contractId: number
  entityId: number
  entity?: Entity // Entity
  contract?: Contract // Contract
}

export type Contract = {
  id: number
  number: any
  startDate: string
  endDate: any
  entityId: number // Entity
  entity?: Entity // Entity
  contracttypeId: number // ContractType
  contractType?: ContractType // ContractType
  createdAt: string
  contractPath?: any
}

export type ContractType = {
  id: 1
  name: string
  shortname: string
  title: string
  lang: 'en'
  code: null
  renewable: 'Y' | 'N'
  duration: 6 | 12
  division: 'NATIONAL' | 'CENTRAL' | 'REGIONAL' | 'DISTRICT' | 'HEALTH_AREA'
  authority: 'PRIMARY' | 'SECONDARY'
}

export type Account = {
  id: number
  name: string
  bank: string
  number: string
}

// %END =============================

export type FactureMetaData = {
  title: string
  day: number
  month: number
  year: number
  wilaya: number
  moughtaa: number
  zoneSanitaire: number
  entity: string //formation sanitaire
  bank: string
  bankAccount: number | string
  period?: string
}
export type FactureData = Array<{
  qde: number
  qve: number
  qva: number
  indicator: string
  tarif: number
  amount: number
}>

// %======== CMS ============
export type Post = {
  id: number
  uid: string
  url: string
  title: string
  lang: string
  excerpt: string
  content: string
  options: string
  locked: number
  published: number
  archived: number
  createdAt: string
  resourceId?: number
  resourceFile?: any
}

export type User = {
  id: number
  login: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  activated: boolean
  langKey: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  authorities: string[]
  password?: string
}

export type Budget = {
  id: number
  uid: string
  year: number
  quarter: number
  month: number
  amount: number
  lang: string
  title: string
  description: string
  openingDate: string
  closedDate: string
  entityId: number
  levelId: number
  entityclassId: number
  entitytypeId: number
  zoneId: number
  budgetizableId: number
  budgetizableType: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdbyId: number
  updatedbyId: number
  deletedbyId: number
  translations_origine: string
  translations: ApiTranslation[]
}
export type Planification = {
  id: number
  uid: string
  month: number
  year: number
  entity: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdbyId: number
  updatedbyId: number
  deletedbyId: number
  translations_origine: string
  translations: ApiTranslation[]
}
