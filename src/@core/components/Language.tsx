'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { classNames } from '../utils'

const LanguageSelect = ({ className = '' }: { className?: string }) => {
  const pathName = usePathname()
  const router = useRouter()
  const { i18n } = useTranslation()
  const current = i18n.language

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const langs = [
    { value: 'ar', label: 'العربية', shortLabel: '🇲🇷 AR' },
    { value: 'fr', label: 'Français', shortLabel: '🇫🇷 FR' },
    { value: 'en', label: 'English', shortLabel: '🇺🇸 EN' }
  ]

  return (
    <select
      value={current}
      onChange={e => {
        const selectedLocale = e.target.value
        handleLangChange(selectedLocale)
      }}
      className={classNames(
        'rounded-md border bg-gray-50 px-6 py-2 text-sm text-slate-800 hover:border-primary-600',
        className
      )}
    >
      {langs.map(locale => (
        <option key={locale.value} value={locale.value}>
          {locale.label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSelect
