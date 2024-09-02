import { Button, ButtonGroup, Typography } from '@mui/material'
import React from 'react'
import * as XLSX from 'xlsx'
import generatePDF from 'react-to-pdf'
import { useReactToPrint } from 'react-to-print'
import { Icon } from '@iconify/react'

const FactureExportl = ({ tableRef }) => {
  const handleGeneratePDF = () => {
    deleteAllSignatureButtons()
    const tables = document.querySelectorAll('table')
    tables.forEach(table => {
      const cells = table.querySelectorAll('td, th')
      cells.forEach(cell => {
        cell.style.padding = '10px'
      })
    })

    generatePDF(tableRef)
  }
  const handlePrint = useReactToPrint({
    content: () => tableRef.current
  })

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const fileName = 'table_export'

    const table = tableRef.current

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.table_to_sheet(table)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Generate Excel file and download
    XLSX.writeFile(workbook, fileName + fileExtension)
  }

  const deleteAllSignatureButtons = () => {
    // id = sign_buttons
    const buttons = document.querySelectorAll('#sign_buttons')
    buttons.forEach(button => {
      button.remove()
    })
  }

  return (
    <>
      <ButtonGroup>
        <Button
          onClick={() => {
            deleteAllSignatureButtons()
            handlePrint()
          }}
          variant='text'
          color='warning'
        >
          <Icon fontSize={'2rem'} fontWeight={'1rem'} icon='bi:printer' />
        </Button>
        <Button onClick={exportToExcel} variant='text' color='primary'>
          <Icon fontSize={'2rem'} fontWeight={'1rem'} icon='vscode-icons:file-type-excel' />
        </Button>
        <Button onClick={handleGeneratePDF} variant='text' color='error'>
          <Icon fontSize={'2rem'} fontWeight={'1rem'} icon='bi:filetype-pdf' />
        </Button>
      </ButtonGroup>
    </>
  )
}

export default FactureExportl
