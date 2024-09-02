// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import { fetchRemaningEntities } from 'src/api/other'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createFile } from 'src/api/data/file'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import FallbackSpinner from '../spinner'

const EntitesPopPup = ({
  open,
  setOpen,
  fileType,
  month,
  year,
  id
}: {
  open: boolean
  setOpen: (val: boolean) => void
  fileType: string
  month: number
  id: number
  year: number
}) => {
  // ** States
  const { t } = useTranslation()
  const router = useRouter()

  const { data, isFetching } = useQuery({
    queryKey: ['fetchRemaningEntities', id, month],
    queryFn: () => fetchRemaningEntities(year, month, id),
    enabled: open
  })

  const create = async ({ entity }: { entity: number }) => {
    try {
      if (
        !confirm(`Voulez-vous vraiment créer un fichier ?
      Entité: ${entity}
      Mois/Trim: ${month}
      Année: ${year}
      Type de fichier: ${fileType}
      `)
      )
        return
      const res = await createFile({
        day: 1,
        month: month,
        year: year,
        filetypeId: id,
        entityId: entity,
        updateFlag: 0,
        totalValue: 0.0
      })

      setOpen(false)
      toast.success(t('file') + t('created successfully'))
      router.push(`/admin/data/data-entry/edit/${res.id}`)
    } catch (error) {
      setOpen(false)
      toast.error('Erreur lors de la création du fichier')
    }
  }

  const handleClose = () => setOpen(false)

  return (
    <div className='demo-space-x'>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>{fileType}</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('entity')}</TableCell>
                  <TableCell>{t('responsable')}</TableCell>
                  <TableCell>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <FallbackSpinner onlySpinner />
                    </TableCell>
                  </TableRow>
                )}
                {!isFetching &&
                  data?.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.responsable}</TableCell>
                      <TableCell>
                        <Button variant='contained' color='primary' onClick={() => create({ entity: row.entity_id })}>
                          {t('create')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EntitesPopPup
