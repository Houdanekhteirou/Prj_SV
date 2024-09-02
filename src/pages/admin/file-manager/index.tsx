import { useQuery } from '@tanstack/react-query'
import {
  ChonkyActions,
  ChonkyFileActionData,
  ChonkyIconName,
  FileAction,
  FileArray,
  FileBrowserProps,
  FileData,
  FileHelper,
  FullFileBrowser,
  setChonkyDefaults
} from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FilePreview2 from 'src/@core/components/file-previw/Preview2'
import FallbackSpinner from 'src/@core/components/spinner'
import {
  createPbfMediaRepositorie,
  deletePbfMediaRepositorie,
  deletePbfMediaResource,
  fetchPbfMediaRepositories,
  updatePbfMediaRepositorie,
  updatePbfMediaResource
} from 'src/api/file-manager'
import { saveDocsToReposisotry } from 'src/api/other'
import authConfig from 'src/configs/auth'
import { getPrivatePath } from 'src/constants'
import DemoFsMap from './demo.fs_map.json'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

// We define a custom interface for file data because we want to add some custom fields
// to Chonky's built-in `FileData` interface.
interface CustomFileData extends FileData {
  parentId?: string
  childrenIds?: string[]
}
interface CustomFileMap {
  [fileId: string]: CustomFileData
}

// Helper method to attach our custom TypeScript types to the imported JSON file map.
const prepareCustomFileMap = () => {
  const baseFileMap = DemoFsMap.fileMap as unknown as CustomFileMap
  const rootFolderId = DemoFsMap.rootFolderId

  return { baseFileMap, rootFolderId }
}

// Hook that sets up our file map and defines functions used to mutate - `deleteFiles`,
// `moveFiles`, and so on.
const useCustomFileMap = (
  fileMap: CustomFileMap,
  currentFolderId: string,
  setFileMap: (fileMap: CustomFileMap) => void
) => {
  const currentFolderIdRef = useRef(currentFolderId)
  useEffect(() => {
    currentFolderIdRef.current = currentFolderId
  }, [currentFolderId])

  const deleteFiles = useCallback(
    async (files: CustomFileData[], t: any) => {
      // ask for confirmation
      if (!window.confirm(t('file-manager.delete-confirm'))) {
        return
      }
      const newFileMap = { ...fileMap }
      for (const file of files) {
        try {
          if (file.isDir) {
            await deletePbfMediaRepositorie(file.id)
          } else {
            await deletePbfMediaResource(file.id)
          }
          delete newFileMap[file.id]
          const parent = newFileMap[currentFolderIdRef.current]
          newFileMap[currentFolderIdRef.current] = {
            ...parent,
            childrenIds: parent.childrenIds!.filter(id => id !== file.id)
          }
          toast.success(t('file-manager.delete-success') + ': ' + file.name)
        } catch (error) {
          toast.error(t('file-manager.delete-error') + ': ' + file.name)
        }
      }
      setFileMap(newFileMap)
    },
    [currentFolderIdRef, deletePbfMediaRepositorie, deletePbfMediaResource, currentFolderId, setFileMap, fileMap]
  )

  const moveFiles = useCallback(
    async (files: CustomFileData[], source: CustomFileData, destination: CustomFileData) => {
      // update the file by setting the new repository id and update repository by setting the new parent id
      const newFileMap = { ...fileMap }
      const parent = newFileMap[source.id]
      console.log('source', source)
      console.log('parent', parent)
      console.log('newFIlema', newFileMap)

      // return
      for (const file of files) {
        try {
          if (file.isDir) {
            await updatePbfMediaRepositorie(file.id, { parentId: destination.id, id: file.id })
          } else {
            await updatePbfMediaResource(file.id, { repositoryId: destination.id, id: file.id })
          }
          const parent = newFileMap[source.id]

          newFileMap[source.id] = {
            ...parent,
            childrenIds: parent.childrenIds!.filter(id => id !== file.id),
            childrenCount: parent.childrenCount! - 1
          }
          const newParent = newFileMap[destination.id]
          newFileMap[destination.id] = {
            ...newParent,
            childrenIds: [...newParent.childrenIds!, file.id],
            childrenCount: newParent.childrenCount! + 1
          }
          toast.success('file-manager.move-success' + file.name)
        } catch (error) {
          console.log(error)
          toast.error('file-manager.move-error' + file.name)
        }
      }

      setFileMap(newFileMap)
    },
    [fileMap, currentFolderIdRef, currentFolderId]
  )

  const idCounter = useRef(0)
  const createFolder = useCallback(async (folderName: string) => {
    try {
      const response = await createPbfMediaRepositorie({
        name: folderName,
        title: folderName.replace(/ /g, '_').toLowerCase(),
        parentId: currentFolderIdRef.current,
        protectedField: false
      })
      const newFolderId = response.id
      setFileMap(currentFileMap => {
        const newFileMap = { ...currentFileMap }
        newFileMap[newFolderId] = {
          id: newFolderId,
          name: folderName,
          isDir: true,
          modDate: new Date(),
          parentId: currentFolderIdRef.current,
          childrenIds: [],
          childrenCount: 0
        }
        const parent = newFileMap[currentFolderIdRef.current]
        if (parent) {
          newFileMap[currentFolderIdRef.current] = {
            ...parent,
            childrenIds: [...parent.childrenIds, newFolderId]
          }
        }

        return newFileMap
      })
    } catch (error) {
      toast.error('file-manager.create-folder-exists')
    }
  }, [])

  const uploadFiles = useCallback(
    async (files: File[], t: any) => {
      const newFileMap = { ...fileMap }
      console.log('in')
      setFileMap(currentFileMap => {
        const newFileMap = { ...currentFileMap }
        const parent = newFileMap[currentFolderIdRef.current]
        newFileMap[currentFolderIdRef.current] = {
          ...parent,
          childrenIds: [...parent.childrenIds!, Math.random().toString()]
        }

        return newFileMap
      })

      for (const file of files) {
        // add a blank file to the repository

        const fileExists = Object.values(newFileMap).find(f => f.name == file.name)

        if (fileExists) {
          const currentFolder = newFileMap[currentFolderIdRef.current]
          if (currentFolder.childrenIds?.includes(fileExists.id)) {
            toast.error(t('file-manager.file-exists') + ': ' + file.name)

            return
          }
        }
        const extension = file.name.split('.').pop()
        const fileName = prompt(t('file-manager.rename-file') + ': ' + file.name, file.name.split('.')[0])

        const response = await saveDocsToReposisotry({
          file: file,
          repositoryId: currentFolderIdRef.current,
          newFileName: fileName + '.' + extension
        })

        if (response && response.data) {
          newFileMap[response.data.id] = {
            id: response.data.id,
            name: response.data.filename,
            isDir: false,
            modDate: new Date(),
            parentId: currentFolderIdRef.current
          }

          const parent = newFileMap[currentFolderIdRef.current]
          newFileMap[currentFolderIdRef.current] = {
            ...parent,
            childrenIds: [...parent.childrenIds!, response.data.id]
          }
          toast.success(t('file-manager.upload-success') + ': ' + file.name)
        } else {
          toast.error(t('file-manager.upload-error') + ': ' + file.name)
        }
      }
      setFileMap(newFileMap)
    },
    [currentFolderIdRef, idCounter, saveDocsToReposisotry, fileMap, currentFolderId, setFileMap]
  )

  const renameFile = useCallback(
    async (file: CustomFileData, newName: string) => {
      const newFileMap = { ...fileMap }
      console.log(file)
      console.log(newName)
      try {
        if (file.isDir) {
          await updatePbfMediaRepositorie(file.id, { name: newName, id: file.id })
        } else {
          await updatePbfMediaResource(file.id, { name: newName, id: file.id })
        }
        newFileMap[file.id] = {
          ...file,
          name: newName
        }
        setFileMap(newFileMap)
        toast.success('file-manager.rename-success' + file.name)
      } catch (error) {
        toast.error('file-manager.rename-error' + file.name)
      }
    },
    [fileMap, setFileMap]
  )

  const downloadFiles = useCallback(async (files: CustomFileData[], t: any) => {
    for (const file of files) {
      try {
        const response = await fetch(getPrivatePath(file.id) + '-R', {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)!}`
          }
        })
        const blob = await response.blob()
        console.log('blob', blob)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        toast.error('file-manager.download-error' + file.name)
      }
    }
  }, [])

  return {
    fileMap,
    deleteFiles,
    moveFiles,
    createFolder,
    uploadFiles,
    renameFile,
    downloadFiles
  }
}

export const useFiles = (fileMap: CustomFileMap, currentFolderId: string, isLoading: boolean): FileArray => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId]
    const childrenIds = currentFolder.childrenIds!
    const files = childrenIds.map((fileId: string) => fileMap[fileId])

    return files
  }, [currentFolderId, fileMap, isLoading])
}

export const useFolderChain = (fileMap: CustomFileMap, currentFolderId: string, isLoading): FileArray => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId]

    const folderChain = [currentFolder]

    let parentId = currentFolder.parentId
    while (parentId) {
      const parentFile = fileMap[parentId]
      if (parentFile) {
        folderChain.unshift(parentFile)
        parentId = parentFile.parentId
      } else {
        break
      }
    }

    return folderChain
  }, [currentFolderId, fileMap, isLoading])
}

export const useFileActionHandler = (
  setCurrentFolderId: (folderId: string) => void,
  deleteFiles: (files: CustomFileData[], t: any) => void,
  moveFiles: (files: FileData[], source: FileData, destination: FileData) => void,
  createFolder: (folderName: string) => void,
  uploadFiles: (files: File[], t: any) => void,
  rename: (file: CustomFileData, newName: string) => void,
  t: any,
  setFilePreviewData: any,
  downloadFiles: (files: CustomFileData[], t: any) => void
) => {
  return useCallback(
    (data: ChonkyFileActionData) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload
        const fileToOpen = targetFile ?? files[0]
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id)

          return
        }
      } else if (data.id === 'delete_file') {
        deleteFiles(data.state.selectedFilesForAction!, t)
      } else if (data.id === ChonkyActions.MoveFiles.id) {
        moveFiles(data.payload.files, data.payload.source!, data.payload.destination)
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        const folderName = prompt('Provide the name for your new folder:')
        if (folderName) createFolder(folderName)
      } else if (data.id === ChonkyActions.UploadFiles.id) {
        // now render an input element to upload files
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true

        // csv,pdf,xslx,docx,mp4,webm,mp3
        // input.accept = '.csv, .pdf, .xlsx, .docx, .mp4, .webm, .mp3'

        input.onchange = () => {
          if (input.files) {
            uploadFiles(Array.from(input.files), t)
          }
        }
        input.click()
      } else if (data.id === 'rename') {
        const file = data.state.selectedFilesForAction![0]

        const newName = prompt('Enter the new name for the file:', file.name.split('.')[0])
        if (newName) rename(file, newName + (!file.isDir ? '.' + file.name.split('.')[1] : ''))
      } else if (data.id === 'open_selection') {
        console.log('open_selection')
        const file = data.state.selectedFilesForAction![0]
        if (file.isDir) {
          setCurrentFolderId(file.id)

          return
        }

        const type = file.name.split('.').pop()
        const filePath = getPrivatePath(file.id)
        setFilePreviewData({ type, filePath })
      } else if (data.id === 'download_file') {
        downloadFiles(data.state.selectedFilesForAction!, t)
      }
    },
    [
      createFolder,
      deleteFiles,
      moveFiles,
      setCurrentFolderId,
      uploadFiles,
      rename,
      t,
      setFilePreviewData,
      downloadFiles
    ]
  )
}

export type VFSProps = Partial<FileBrowserProps>

export const VFSBrowser: React.FC<VFSProps> = React.memo(props => {
  const [currentFolderId, setCurrentFolderId] = useState('' as string)
  const [filePreviewData, setFilePreviewData] = useState(null as any)
  const [fileMap, setFileMap] = useState({} as CustomFileMap)
  const [isUploading, setIsUploading] = useState(false) // New state for loading

  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['pbf-media-repositories', 'explorer'],
    queryFn: () => fetchPbfMediaRepositories()
  })

  const { baseFileMap, rootFolderId } = useMemo(() => {
    if (!isLoading && data) {
      return {
        baseFileMap: data.fileMap,
        rootFolderId: data.rootFolderId
      }
    }

    return {
      baseFileMap: prepareCustomFileMap().baseFileMap,
      rootFolderId: prepareCustomFileMap().rootFolderId
    }
  }, [data, isLoading])

  useEffect(() => {
    setCurrentFolderId(rootFolderId)
    setFileMap(baseFileMap)
  }, [rootFolderId, baseFileMap])

  const files = useMemo(() => {
    if (isLoading || !currentFolderId || !fileMap || !fileMap[currentFolderId]) {
      return []
    }

    const currentFolder = fileMap[currentFolderId]
    const childrenIds = currentFolder.childrenIds!
    const files = childrenIds.map((fileId: string) => fileMap[fileId])

    return files
  }, [fileMap, isLoading, currentFolderId])

  const folderChain = useMemo(() => {
    if (isLoading || !currentFolderId || !fileMap || !fileMap[currentFolderId]) {
      return []
    }
    const currentFolder = fileMap[currentFolderId]

    const folderChain = [currentFolder]

    let parentId = currentFolder.parentId
    while (parentId) {
      const parentFile = fileMap[parentId]
      if (parentFile) {
        folderChain.unshift(parentFile)
        parentId = parentFile.parentId
      } else {
        break
      }
    }

    return folderChain
  }, [currentFolderId, fileMap, isLoading])

  const { deleteFiles, moveFiles, createFolder, uploadFiles, renameFile, downloadFiles } = useCustomFileMap(
    fileMap,
    currentFolderId,
    setFileMap
  )

  const handleFileAction = useFileActionHandler(
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder,
    uploadFiles,
    renameFile,
    t,
    setFilePreviewData,
    downloadFiles
  )

  const fileActions: FileAction[] = useMemo(
    () => [
      {
        id: 'create_folder',
        button: {
          name: 'Créer un dossier',
          toolbar: true,
          contextMenu: true,
          icon: ChonkyIconName.folderCreate
        }
      },
      {
        id: 'upload_files',
        button: {
          name: 'Importer',
          toolbar: true,
          contextMenu: true,
          icon: ChonkyIconName.upload
        }
      },
      {
        id: 'delete_file',
        requiresSelection: true,
        hotkeys: ['delete'],
        button: {
          name: 'supprimer',
          toolbar: true,
          contextMenu: true,
          icon: ChonkyIconName.trash
        }
      },
      {
        id: 'rename',
        requiresSelection: true,
        hotkeys: ['f2'],
        button: {
          name: 'Renomer',
          toolbar: true,
          contextMenu: true,
          icon: '',
          group: 'Actions'
        }
      },
      {
        id: 'open_selection',
        requiresSelection: true,
        hotkeys: ['enter'],
        button: {
          name: 'Ouvrir',
          toolbar: true,
          contextMenu: true,
          icon: ChonkyIconName.openFiles,
          group: 'Actions'
        }
      },
      {
        id: 'download_file',
        requiresSelection: true,
        hotkeys: ['ctrl+s'],
        button: {
          name: 'Télécharger',
          toolbar: true,
          contextMenu: true,
          icon: ChonkyIconName.download,
          group: 'Actions'
        }
      }
    ],
    []
  )
  const thumbnailGenerator = useCallback(
    (file: FileData) => (file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null),
    []
  )

  if (isLoading) {
    return <FallbackSpinner />
  }

  return (
    <>
      <div style={{ height: 700 }}>
        <FullFileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={fileActions}
          onFileAction={handleFileAction}
          thumbnailGenerator={thumbnailGenerator}
          clearSelectionOnOutsideClick={true}
          {...props}
        />

        {filePreviewData !== null && (
          <FilePreview2
            type={filePreviewData.type}
            filePath={filePreviewData.filePath}
            setFilePreviewData={setFilePreviewData}
          />
        )}
      </div>
    </>
  )
})

export default VFSBrowser
