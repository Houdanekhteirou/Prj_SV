import { convertNumberToFrenchWords } from './num-to-fr-world'
import { converNumberToArabicWorlds } from './num-to-ar-world'

export const convertNumberToWords = (num: number) => {
  const lang = localStorage.getItem('i18nextLng')
  switch (lang) {
    case 'fr':
      return convertNumberToFrenchWords(num)
    case 'ar':
      return converNumberToArabicWorlds(num)
    default:
      return num
  }
}
