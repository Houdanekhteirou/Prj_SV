// ** MUI Imports
import { Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { fetchPermissions } from 'src/api/access-management/permissions'
import { PERMISSIONS } from 'src/constants'
import { updateRole } from 'src/api/access-management/rols'

const RoleForm = ({ open, handleClose, role }) => {
  const { t } = useTranslation()
  const [selectedTasks, setSelectedTasks] = useState([])
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [operations, setOperations] = useState([])

  useEffect(() => {
    let ops = []
    for (const key in PERMISSIONS) {
      // we neet them to be unique remove the numbers
      ops = [...new Set([...ops, ...Object.keys(PERMISSIONS[key]).map(p => p.replace(/[0-9]/g, ''))])]
    }
    setOperations(ops)
  }, [])

  const { id, name, description } = role
  useEffect(() => {
    setRoleName(name)
    setRoleDescription(description)

    if (role.permissions) {
      setSelectedTasks(role.permissions.map(p => p.permissionId))
    }
  }, [role])

  const { data, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => fetchPermissions({})
  })

  const handleTaskChange = (e, task) => {
    if (e.target.checked) {
      setSelectedTasks([...selectedTasks, data.find(item => item.name === task)?.id])
    } else {
      setSelectedTasks(selectedTasks.filter(item => item !== data.find(item => item.name === task)?.id))
    }
  }

  function checkPermissions(perm) {
    const requiredPermissions = ['read', 'update', 'delete', 'write']

    const permissions = perm.sort()
    requiredPermissions.sort()
    const isEqual = JSON.stringify(permissions) === JSON.stringify(requiredPermissions)

    return isEqual
  }

  const render = () => {
    if (isLoading) return <p>Loading...</p>

    const firstRow = Object.keys(PERMISSIONS).map((module, index) => {
      if (checkPermissions(Object.keys(PERMISSIONS[module]))) {
        return (
          <TableRow key={index}>
            <TableCell>{t(module)}</TableCell>
            {Object.keys(PERMISSIONS[module]).map(permission => (
              <TableCell key={index}>
                <FormControlLabel
                  // label={
                  //   data.find(item => item.name === PERMISSIONS[module][permission])?.title +
                  //   '-' +
                  //   data.find(item => item.name === PERMISSIONS[module][permission])?.name
                  // }
                  control={
                    <Checkbox
                      checked={selectedTasks.some(
                        task => task === data.find(item => item.name === PERMISSIONS[module][permission])?.id
                      )}
                      onChange={e => handleTaskChange(e, PERMISSIONS[module][permission])}
                    />
                  }
                />
              </TableCell>
            ))}
          </TableRow>
        )
      }
    })

    const secondRow = Object.keys(PERMISSIONS).map((module, index) => {
      if (!checkPermissions(Object.keys(PERMISSIONS[module]))) {
        return (
          <TableRow key={index}>
            <TableCell>{t(module)}</TableCell>

            <TableCell key={index}>
              <div className='flex flex-wrap'>
                {Object.keys(PERMISSIONS[module]).map(permission => (
                  <div key={index}>
                    <FormControlLabel
                      label={data.find(item => item.name === PERMISSIONS[module][permission])?.title}
                      control={
                        <Checkbox
                          checked={selectedTasks.some(
                            task => task === data.find(item => item.name === PERMISSIONS[module][permission])?.id
                          )}
                          onChange={e => handleTaskChange(e, PERMISSIONS[module][permission])}
                        />
                      }
                    />
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        )
      }
    })

    return (
      <div>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                width: '200px'
              }}
            >
              {t('Module')}
            </TableCell>
            <TableCell
              sx={{
                width: '200px'
              }}
            >
              {t('read')}
            </TableCell>
            <TableCell
              sx={{
                width: '200px'
              }}
            >
              {t('write')}
            </TableCell>
            <TableCell
              sx={{
                width: '200px'
              }}
            >
              {t('update')}
            </TableCell>
            <TableCell
              sx={{
                width: '200px'
              }}
            >
              {t('delete')}
            </TableCell>
          </TableRow>
        </TableHead>
        {firstRow}
        <Typography variant='h6'>{t('Extra permissions')}</Typography>
        {secondRow}
      </div>
    )
  }

  const action = async e => {
    e.preventDefault()

    if (id && roleName) {
      const res = await updateRole(id, {
        permissions: selectedTasks.map(p => ({ permissionId: p })),
        name: roleName,
        description: roleDescription
      })
      if (res) {
        toast.success('Role Updated')
        setRoleName('')
        setRoleDescription('')
        setSelectedTasks([])
        handleClose()
      } else {
        setSelectedTasks([])
        setRoleName('')
        setRoleDescription('')
        toast.error('Error')
      }
    }
  }

  return (
    <Dialog fullWidth maxWidth='lg' scroll='body' onClose={handleClose} open={open}>
      <form onSubmit={e => action}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h5' component='span'>
            {t(`Modification de rôle ${t(name)}`)}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth required>
              <TextField
                label={t('Role Name')}
                placeholder='Enter Role Name'
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                required
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl required fullWidth>
              <TextField
                label={t('Role Description')}
                rows={3}
                multiline
                placeholder='Enter Role Description'
                value={roleDescription}
                required
                onChange={e => setRoleDescription(e.target.value)}
              />
            </FormControl>
          </Box>
          <Typography variant='h6'>{t('Autorisations de rôle')}</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {/* <TableHead>
                  <TableRow>
                    <TableCell>{t('Operations')}</TableCell>
                    {operations.map((operation, index) => (
                      <TableCell key={index}>{t(operation)}</TableCell>
                    ))}
                  </TableRow>
                </TableHead> */}
                <TableBody>{render()}</TableBody>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button size='large' type='submit' variant='contained' onClick={action}>
              {t('enregistrer')}
            </Button>
            <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
              {t('Annuler')}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoleForm
