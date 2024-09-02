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

export const logos = {
  small: '/logos/small.png',
  medium: '/logos/medium.png',
  large: '/logos/large.png'
}

export const authorityOptions = [
  { value: 'PRIMARY', label: 'PRIMARY' },
  { value: 'SECONDARY', label: 'SECONDARY' }
]

export const contractStatusOptions = [
  { value: 'EXPIRED', label: 'EXPIRED' },
  { value: 'VALID', label: 'VALID' },
  { value: 'ALL', label: 'ALL' }
]

export const divisionOptions = [
  { value: 'NATIONAL', label: 'NATIONAL' },
  { value: 'CENTRAL', label: 'CENTRAL' },
  { value: 'REGIONAL', label: 'REGIONAL' },
  { value: 'DISTRICT', label: 'DISTRICT' },
  { value: 'HEALTH_AREA', label: 'HEALTH_AREA' }
]

export const authorityEnum = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY'
}

export const contractStatusEnum = {
  EXPIRED: 'EXPIRED',
  VALID: 'VALID',
  ALL: 'ALL'
}

export const divisionEnum = {
  NATIONAL: 'NATIONAL',
  CENTRAL: 'CENTRAL',
  REGIONAL: 'REGIONAL',
  DISTRICT: 'DISTRICT',
  HEALTH_AREA: 'HEALTH_AREA'
}

export const repoEnum = {
  CONTRACTS: 'contract_scans',
  ENTITIES: 'entity_images',
  POSTS: 'cms',
  INDICATEURS: 'icon_indicateur'
}

export const getPath = id => {
  return `${process.env.NEXT_PUBLIC_API_URP}/api/resource/${id}`
}

export const getPrivatePath = id => {
  return `${process.env.NEXT_PUBLIC_API_URP}/api/asset/resource/${id}`
}

export const configEnum = {
  CONTRACTS_SEASON: 'CONTRACTS_SEASON'
}

export const reportsTypesEnum = {
  CONSOLIDE_MENSUELLE_WILAYA: 'facture_mensuelle_wil',
  CONSOLIDE_MENSUELLE_MOUGHATAA: 'facture_mensuelle_moug',
  CONSOLIDE_MENSUELLE_AS: 'facture_mensuelle_as',
  CONSOLIDE_MENSUELLE_PRESTATAIRES: 'facture_mensuelle_prest',
  BONUS_QUALITE: 'facture_bonus_qlty_entity'
}
