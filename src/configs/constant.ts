export const trimOptions = [
  { value: 1, label: '1er Trimestre' },
  { value: 2, label: '2eme Trimestre' },
  { value: 3, label: '3eme Trimestre' },
  { value: 4, label: '4eme Trimestre' }
]

export const posts_options = [
  { value: 'news', label: 'News' },
  { value: 'docs', label: 'Docs' },
  { value: 'testiomony', label: 'testimony' },
  { value: 'organizat', label: 'organizat' }
]

export const PERMISSIONS: any = {
  file: {
    read: 'FILE:READ',
    write: 'FILE:ADD',
    update: 'FILE:DATAMNGR',
    delete: 'FILE:DELETE'
  },
  fileType: {
    read: 'fileType:read',
    write: 'fileType:write',
    update: 'fileType:update',
    delete: 'fileType:delete'
  },
  element: {
    read: 'ELEMENTS:READ',
    write: 'ELEMENTS:ADD',
    update: 'ELEMENTS:EDIT',
    delete: 'ELEMENTS:DELETE'
  },
  zone: {
    read: 'ZONE:READ',
    write: 'ZONE:ADD',
    update: 'ZONE:EDIT',
    delete: 'ZONE:DEL'
  },
  entity: {
    read: 'ENTITY:READ',
    write: 'ENTITY:ADD',
    update: 'ENTITY:EDITENTITY',
    delete: 'ENTITY:DELENTITY'
  },
  entityType: {
    read: 'ENTITY_TYPE:READ',
    write: 'ENTITY_TYPE:ADD',
    update: 'ENTITY_TYPE:EDIT',
    delete: 'ENTITY_TYPE:DEL'
  },
  entityClass: {
    read: 'ENTITY_CLASS:READ',
    write: 'ENTITY_CLASS:ADD',
    update: 'ENTITY_CLASS:EDIT',
    delete: 'ENTITY_CLASS:DEL'
  },
  cms: {
    read: 'CMS:READ',
    write: 'CMS:ADD',
    update: 'CMS:EDIT',
    delete: 'CMS:DEL'
  },
  Gestion_acces: {
    read: 'USER:READ',
    write: 'USER:ADD',
    update: 'USER:EDIT',
    delete: 'USER:DEL'
  },
  bank: {
    read: 'BANKS:READ',
    write: 'BANKS:ADD',
    update: 'BANKS:EDIT',
    delete: 'BANKS:DEL'
  },
  completeness: {
    read: 'completeness:read'
  },
  permissionRequest: {
    read: 'permissionRequest:read',
    approve: 'permissionRequest:approve',
    reject: 'permissionRequest:reject'
  },
  report: {
    factureMensuelleEcd: 'REPORT:FACTURE_MENSUELLE_ECD',
    factureMensuelleFosa: 'REPORT:FACTURE_MENSUELLE_FOSA',
    factureMensuelleMutuelles: 'REPORT:FACTURE_MENSUELLE_MUTUELLES',
    factureTrimestrielleEcd: 'REPORT:FACTURE_TRIMESTRIELLE_ECD',
    factureTrimestrielleFosa: 'REPORT:FACTURE_TRIMESTRIELLE_FOSA',
    invoiceDet: 'REPORT:INVOICE_DET',
    invoices: 'REPORT:INVOICES',
    monthlyPaymentOrder: 'REPORT:MONTHLY_PAYMENT_ORDER',
    monthlyPaymentRequest: 'REPORT:MONTHLY_PAYMENT_REQUEST',
    quarterlyConsolidated: 'REPORT:QUARTERLY_CONSOLIDATED',
    quarterlyPaymentOrder: 'REPORT:QUARTERLY_PAYMENT_ORDER',
    rapportBm: 'REPORT:RAPPORT_BM'
  },
  dashboard: {
    completudeFileType: 'completudeFileType',
    qualityQuantiyChart: 'qualityQuantiyChart',
    logs: 'logs',
    completudeFosa: 'completudeFosa'
  },
  donors: {
    read: 'donors:read',
    write: 'donors:write',
    update: 'donors:update',
    delete: 'donors:delete'
  },
  settings: {
    read: 'settings:read',
    update: 'settings:update'
  },
  population: {
    read: 'POPULATION:READ',
    write: 'POPULATION:ADD',
    update: 'POPULATION:EDIT',
    delete: 'POPULATION:DEL'
  },
  budget: {
    read: 'BUDGETS:READ',
    write: 'BUDGETS:ADD',
    update: 'BUDGETS:EDIT',
    delete: 'BUDGETS:DEL'
  },
  validation: {
    read: 'valid_files_list',
    individuel: 'validation_level:individual',
    regional: 'validation_level:regional',
    national: 'validation_level:national'
  },
  password: {
    all_password: 'change_password',
    group_password: 'change_password:group'
  }
}

export const logos = {
  small: '/logos/small.png',
  medium: '/logos/medium.png',
  large: '/logos/large.png'
}
