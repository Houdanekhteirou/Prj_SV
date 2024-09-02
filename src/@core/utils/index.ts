import Yup from 'yup'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatNumberWithDots(num: number) {
  // Convert the number to a string
  if (!num) return ''

  // return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'MRU' }).format(num)

  const numString = num.toString()

  // Split the string into an array of characters
  const numArray = numString.split('')

  // Reverse the array for easier insertion of dots
  numArray.reverse()

  // Use a loop to insert dots every three digits
  for (let i = 3; i < numArray.length; i += 4) {
    numArray.splice(i, 0, '.')
  }

  // Reverse the array back to the original order
  numArray.reverse()

  // Join the array back into a string
  const formattedNumber = numArray.join('')

  return formattedNumber
}

export function formatNumber(num) {
  if (!num) return ''
  const lang = localStorage.getItem('i18nextLng')

  switch (lang) {
    case 'fr':
      return new Intl.NumberFormat('fr-FR').format(num)
    case 'ar':
      return new Intl.NumberFormat('ar-MA').format(num)
    default:
      return new Intl.NumberFormat('en-US').format(num)
  }
}

export const getLogo = locale => {
  const width = window.innerWidth
  switch (true) {
    case width > 1000:
      return `/logos/l_${locale}.png`
    case width < 1000 && width > 600:
      return `/logos/m_${locale}.png`
    case width < 600:
      return `/logos/s_${locale}.png`
  }
}

export function formatNumberWithSpaces(num: number) {
  // Convert the number to a string
  if (!num) return ''
  const lang = localStorage.getItem('i18nextLng')

  switch (lang) {
    case 'fr':
      return new Intl.NumberFormat('fr-FR').format(num)

    case 'ar':
      return new Intl.NumberFormat('ar-MA').format(num)
    default:
      return new Intl.NumberFormat('en-US').format(num)
  }

  return new Intl.NumberFormat('en-emodeng', { style: 'currency', currency: 'MRU' }).format(num)

  // Manage the case of float numbers
  const numString = num.toString().split('.')[0]
  const decimal = num.toString().split('.')[1]

  // Split the string into an array of characters
  const numArray = numString.split('')

  // Use a loop to insert spaces every three digits
  for (let i = 3; i < numArray.length; i += 4) {
    numArray.splice(i, 0, ' ')
  }

  // Join the array back into a string
  const formattedNumber = numArray.join('').concat(decimal ? `.${decimal}` : '')

  return formattedNumber
}

export const monthsObjectFrench = {
  1: 'Janvier',
  2: 'Février',
  3: 'Mars',
  4: 'Avril',
  5: 'Mai',
  6: 'Juin',
  7: 'Juillet',
  8: 'Août',
  9: 'Septembre',
  10: 'Octobre',
  11: 'Novembre',
  12: 'Décembre'
}

export const monthsObjectArabic = {
  1: 'يناير',
  2: 'فبراير',
  3: 'مارس',
  4: 'أبريل',
  5: 'مايو',
  6: 'يونيو',
  7: 'يوليو',
  8: 'أغسطس',
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر'
}

export const years = Array.from({ length: 1 }, (_, i) => new Date().getFullYear() - i)

export const validateString = (value: unknown, maxLength: number): value is string => {
  if (!value || typeof value !== 'string' || value.length > maxLength) {
    return false
  }

  return true
}

export const getErrorMessage = (error: unknown): string => {
  let message: string

  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Something went wrong'
  }

  return message
}

export const depsToOptions = (deps: Array<any> | null | undefined, lang?: 'en' | 'ar' | 'fr') => {
  console.log('deps', deps)
  return deps && deps.length > 0
    ? deps?.map(el => ({
        value: el.id,
        label: el.name || el.title || el.id
      }))
    : []
}

export const getValidContractTypes = (contractTypes: Array<any>, entityType: number, entityClasse: number) => {
  return contractTypes
    .filter(
      el =>
        el.entitytypes &&
        JSON.parse(el.entitytypes)?.includes(entityType) &&
        JSON.parse(el.entityclasses).includes(entityClasse)
    )
    .map(el => ({
      value: el.id,
      label: el.title
    }))
}

// Entité(Formation sanitaire):  Calcul de montant quantitative
export function calculateTotalQuantitativeAmount(
  array: Array<{
    amount: number
    [key: string]: any
  }>
) {
  // Using the reduce function to sum up the amounts
  const totalAmount =
    array &&
    array.reduce((acc, curr) => {
      // Check if the current object has the "amount" property
      if (curr.hasOwnProperty('amount')) {
        return acc + curr.amount
      } else {
        // Handle cases where the "amount" property is missing or not a number
        console.error('Invalid object structure. Object must have an "amount" property.')

        return acc
      }
    }, 0)

  return totalAmount
}

export function mapMonthsToTrimesters(months: Array<number | string>) {
  // Function to check if months are consecutive

  const areConsecutive = months => {
    for (let i = 0; i < months.length - 1; i++) {
      if (parseInt(months[i + 1]) - parseInt(months[i]) !== 1) {
        return false
      }
    }

    return true
  }

  // Map month to trimester
  const monthToTrimester = (month: any) => {
    if (month <= 3) return { label: 'Trim 1', value: month }
    if (month <= 6) return { label: 'Trim 2', value: month }
    if (month <= 9) return { label: 'Trim 3', value: month }

    return { label: 'Trim 4', value: month }
  }

  // Check if months are consecutive
  if (areConsecutive(months)) {
    return months.map(el => ({
      value: el,
      label: monthsObjectFrench[el]
    }))
  } else {
    const firstMonth = parseInt(months[0])
    const lastMonth = parseInt(months[months.length - 1])
    const trimesters = []

    for (let month = firstMonth; month <= lastMonth; month += 3) {
      trimesters.push(monthToTrimester(month))
    }

    return trimesters
  }
}

export function getMonthName(month: number, lang: string) {
  switch (lang) {
    case 'fr':
      return monthsObjectFrench[month]
    case 'ar':
      return monthsObjectArabic[month]
    default:
      return monthsObjectFrench[month]
  }
}
export const hasPermission = (userPermissions: string[], requiredPermissions: string | string[]) => {
  if (typeof requiredPermissions === 'string') {
    requiredPermissions = [requiredPermissions]
  }

  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

export const CanViewComponent = ({ userPermissions, requiredPermissions, children }) => {
  return hasPermission(userPermissions, requiredPermissions) ? children : null
}

export function getZonesOptions(wilaya, moughataa, zonesByUser, defaultWilaya?, defaultMoughataa?) {
  if (!zonesByUser?.data) return { wilayaas: [], moughataas: [], zoneSanitaires: [] }
  console.log('zonesByUser', {
    wilaya,
    moughataa,
    zonesByUser
  })
  const zones = (zonesByUser?.data as any) || []
  const wilayas = zones.map(el => ({
    value: el.value,
    label: el.name
  }))

  // Ensure wilaya is defined and has a value
  const moughataas = wilaya
    ? zones
        .find(zone => zone.value == wilaya)
        ?.initialzones?.map(zone => ({
          value: zone.value,
          label: zone.name
        }))
    : []

  // Ensure both wilaya and moughataa are defined and have values
  const zoneSanitaires =
    wilaya && moughataa
      ? zones
          .find(zone => zone.value == wilaya)
          ?.initialzones?.find(zone => zone.value == moughataa)
          ?.initialzones?.map(zone => ({
            value: zone.value,
            label: zone.name
          }))
      : []

  return { wilayas, moughataas, zoneSanitaires }
}

export function calcule_montant_penalite(montant, e) {
  const ecart = e
  if (ecart < 0) {
    return montant
  }

  if (ecart > 20) {
    return 0
  } else if (ecart > 10 && ecart <= 20) {
    return montant - montant * 0.1
  } else if (ecart > 5 && ecart <= 10) {
    return montant - montant * 0.05
  } else {
    return montant
  }
}

export const calculateEcart = (declaredValue: number, verifiedValue: number) => {
  let ecart = 0

  if (!isNaN(declaredValue) && declaredValue !== 0) {
    ecart = declaredValue - verifiedValue
  }

  if (!isNaN(verifiedValue) && verifiedValue !== 0) {
    return Math.round((ecart / verifiedValue) * 100 * 100) / 100
  } else {
    if (ecart !== 0) {
      return ecart * 100
    } else {
      return 0
    }
  }
}

export const isFileDateValid = (month: number, type: 'quantitative' | 'qualitative') => {
  if (process.env.NEXT_PUBLIC_PRODUCTION === 'false') return true
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()
  const fileMonth = +month

  if (type === 'quantitative') {
    if (currentDay >= 2 && currentDay <= 14 && fileMonth === currentMonth) {
      return true
    }
  } else {
    if (currentDay >= 6 && currentDay <= 14 && fileMonth + 1 === currentMonth) {
      return true
    }
  }

  return false
}

export type PageData = {
  [key: string]: any
}
export type RealTimeIndicators = {
  evolution: string
  data: Array<{
    title: string
    isup: boolean
    isdown: boolean
    value: any
    icon: any
  }>
}

export type Option = {
  label?: string
  icon?: any
  nameFr?: string
  nameAr?: string
  value: any
}

export type FormField = {
  name: string
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'datetime'
    | 'select'
    | 'file'
    | 'textEditor'
    | 'checkbox'
    | 'email'
    | 'radio'
    | 'groupSelect'
    | 'email'
    | 'password'
    | 'date'
    | 'multiple'
    | 'grouped'
    | 'entitySelector'
    | 'contractZones'
    | 'FileBrowser'

  label: string
  initialValue?: any | any[]
  placeholder?: string
  required?: boolean
  readOnly?: boolean
  error?: Error | string | undefined
  options?: Array<Option>
  syncTo?: { field: string; func: (value: number) => Promise<any[] | null> }
  isMultiple?: boolean
  currentValue?: any
  setCurrentValue?: React.Dispatch<React.SetStateAction<any>>
  splitFull?: boolean
  hidden?: boolean
  checked?: boolean
  groupOptions?: any
  isMulti?: boolean
  fileType?: string
  className?: string

  // Add style and key properties
  style?: React.CSSProperties
  key?: string
  groupKey?: number
  watcher?: (value: any) => void
  data?: any
  repoTitle?: string
  accept?: string
}

export type FormFieldGroup = {
  name: string
  id: number
}
export type KeyValueItem = {
  label: string
  value: string
  comp: React.ReactNode
}

export type FormSchema = Yup.ObjectSchema<any>

export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

export type Locale = 'en' | 'fr' | 'ar'

export type AnyObject = { [key: string]: any }
