// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'

const FallbackSpinner = ({ sx, onlySpinner = false }: { sx?: BoxProps['sx']; onlySpinner?: boolean }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      {!onlySpinner && <Image src='/images/sv_.png' alt='logo' width={100} height={100} />}
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
