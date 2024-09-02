import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ChonkyActions, ChonkyFileActionData, FileData, FileHelper, FullFileBrowser } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { fetchPbfMediaRepositoryByTitle } from 'src/api/file-manager'
import { saveDocsToReposisotry } from 'src/api/other'
import { getPath, getPrivatePath } from 'src/constants'
import FilePreview2 from 'src/@core/components/file-previw/Preview2'
import { get } from 'http'
import { Icon } from '@iconify/react'

interface CustomFileData extends FileData {
  parentId?: string
  childrenIds?: string[]
}
interface CustomFileMap {
  [fileId: string]: CustomFileData
}

const getFileById = (fileMap: CustomFileMap, fileId: string) => {
  return fileMap[fileId]
}

const useFileActionHandler = (setCurrentFolderId, setValue, name, onClose) => {
  return useCallback(
    (data: ChonkyFileActionData) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload
        const fileToOpen = targetFile ?? files[0]
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id)
        } else if (fileToOpen) {
          console.log('fileToOpen', fileToOpen)
          setValue(name, fileToOpen.id)
          onClose()
        }
      }
    },
    [setCurrentFolderId, setValue, name, onClose]
  )
}

const FileBrowser = ({ name, label, repoTitle, accept }) => {
  const { control, setValue, getValues } = useFormContext()
  const { t } = useTranslation()
  const FileViewer = React.useMemo(() => dynamic(() => import('react-file-viewer'), { ssr: false }), [])
  const [FilePreviewData, setFilePreviewData] = useState(null)

  const [open, setOpen] = useState(false)
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [fileMap, setFileMap] = useState({} as CustomFileMap)
  const [tabIndex, setTabIndex] = useState(1)
  const [loading, setLoading] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pbf-media-repositories', 'explorer'],
    queryFn: () => fetchPbfMediaRepositoryByTitle(repoTitle)
  })

  const { baseFileMap, rootFolderId } = useMemo(() => {
    if (!isLoading) {
      return {
        baseFileMap: data.fileMap,
        rootFolderId: data.rootFolderId
      }
    }

    return {
      baseFileMap: {
        '': {
          id: '',
          name: '',
          isDir: true,
          childrenIds: []
        }
      },
      rootFolderId: ''
    }
  }, [data, isLoading])

  useEffect(() => {
    if (!isLoading) {
      setCurrentFolderId(rootFolderId)
      setFileMap(baseFileMap)
    }
  }, [rootFolderId, baseFileMap, isLoading])

  const files = useMemo(() => {
    if (isLoading || !currentFolderId || !fileMap[currentFolderId]) {
      return []
    }
    const currentFolder = fileMap[currentFolderId]

    return currentFolder.childrenIds?.map(fileId => fileMap[fileId]) || []
  }, [fileMap, isLoading, currentFolderId])

  const folderChain = useMemo(() => {
    if (isLoading || !currentFolderId || !fileMap[currentFolderId]) {
      return []
    }
    const folderChain = []
    let folder = fileMap[currentFolderId]
    while (folder) {
      folderChain.unshift(folder)
      folder = folder.parentId ? fileMap[folder.parentId] : undefined
    }

    return folderChain
  }, [currentFolderId, fileMap, isLoading])

  const onClose = () => setOpen(false)
  const handleFileAction = useFileActionHandler(setCurrentFolderId, setValue, name, onClose)
  const fileActions = useMemo(() => [ChonkyActions.OpenFiles], [])
  const thumbnailGenerator = useCallback(
    file => (file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null),
    []
  )

  const handleFileUpload = event => {
    console.log('accept', accept)
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = false
    fileInput.accept = accept

    fileInput.click()

    fileInput.addEventListener('change', async () => {
      const file = fileInput?.files[0]

      // check if file selected already exists in the repository
      if (Object.values(fileMap).find(f => f.name === file.name)) {
        alert(t('File already exists in the repository you can select it from the PBF Media'))

        return
      }

      setLoading(true)
      const res = await saveDocsToReposisotry({
        repositoryTitle: repoTitle,
        file
      })
      setLoading(false)
      if (res) {
        setValue(name, res.data.id)
        refetch()
        onClose()
      }
    })
  }
  //   <div onClick={() => setOpen(true)} className='flex flex-col gap-2 overflow-x-hidden '>
  //   {t('Select')} {t(label)}
  // </div>
  // {getValues(name) ? (
  //   FilePreviewData === 'preview' ? (
  //     <FilePreview2
  //       filePath={getPrivatePath(getValues(name))}
  //       fileType={getFileById(fileMap, getValues(name))?.name.split('.').pop()}
  //       setFilePreviewData={setFilePreviewData}
  //     />
  //   ) : (
  //     <Button variant='contained' onClick={() => setFilePreviewData('preview')}>
  //       Preview
  //     </Button>
  //   )
  // ) : null}

  return (
    <>
      <div className='flex  gap-2  '>
        <Button variant='contained' onClick={() => setOpen(true)}>
          {getValues(name) ? t('Change') : t('Select')} {t(label)}
        </Button>
        {getValues(name) && (
          <Button variant='contained' onClick={() => setFilePreviewData('preview')} className='flex gap-2'>
            <Icon icon='mdi:eye' />
            {t('Preview')}
          </Button>
        )}
      </div>

      {getValues(name) && FilePreviewData === 'preview' && (
        <FilePreview2
          filePath={getPrivatePath(getValues(name))}
          fileType={getFileById(fileMap, getValues(name))?.name.split('.').pop()}
          setFilePreviewData={setFilePreviewData}
        />
      )}
      <Dialog open={open} onClose={onClose} maxWidth='lg'>
        <DialogTitle>
          {t('Select')} {t(label)}
        </DialogTitle>
        <DialogContent>
          <div className='flex justify-around w-full mb-4'>
            <div
              onClick={() => setTabIndex(1)}
              className={`cursor-pointer ${tabIndex === 1 && 'border-b-2 border-green-600'}`}
            >
              {t('Upload from File System')}
            </div>
            <div
              onClick={() => setTabIndex(0)}
              className={`cursor-pointer ${tabIndex === 0 && 'border-b-2 border-green-600'}`}
            >
              {t('Select from PBF Media')}
            </div>
          </div>

          {tabIndex === 0 && (
            <div style={{ height: 400, width: 800 }}>
              <FullFileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={fileActions}
                onFileAction={handleFileAction}
                thumbnailGenerator={thumbnailGenerator}
                disableDefaultFileActions
                iconComponent={ChonkyIconFA}
              />
            </div>
          )}
          {tabIndex === 1 && (
            <div style={{ height: 400, width: 800 }} className='flex justify-center items-center'>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button variant='contained' component='label' onClick={handleFileUpload}>
                  {t('Upload')}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={onClose}>
            {t('cancel')}
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}

FileBrowser.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  repoTitle: PropTypes.string.isRequired
}

export default React.memo(FileBrowser)
