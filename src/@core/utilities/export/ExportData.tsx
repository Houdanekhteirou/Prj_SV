import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useReactToPrint } from 'react-to-print'
import { downloadExcel, downloadJson, downloadPdf } from '../download/download'

const ExportData = React.forwardRef(({ data, componentToPrintRef }: { data: any; componentToPrintRef: any }) => {
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current
  })
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        color='error'
        onClick={handleClick}
      >
        Export
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handlePrint}>Print Chart!</MenuItem>
        <MenuItem onClick={() => downloadPdf(data)}>Download PDF document</MenuItem>
        <MenuItem onClick={() => downloadJson(data)}>Download JSON</MenuItem>
        <MenuItem onClick={() => downloadExcel(data)}>Download Excel document</MenuItem>
      </Menu>
    </div>
  )
})

export default ExportData
