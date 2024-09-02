// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface Props {
  text: string
}

const Translations = ({ text, className }: Props) => {
  // ** Hook
  const { t } = useTranslation()

  return <span className={className}>{`${t(text)}`}</span>
}

export default Translations
