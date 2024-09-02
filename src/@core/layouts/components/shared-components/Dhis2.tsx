// ** React Import
import Avatar from '@mui/material/Avatar'
import Link from 'next/link'

// ** Custom Components Imports

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const dhis2 = ({ settings, saveSettings }: Props) => {
  return (
    <div>
      <Link href='/admin/dhis2'>
        <Avatar src='/images/logos/dhis2.jpeg' alt='dhis2' />
      </Link>
    </div>
  )
}

export default dhis2
