import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import FallbackSpinner from '../spinner'
import { IconButton } from '@mui/material'
import { Icon } from '@iconify/react'

const FilePreview2 = ({ filePath, type, setFilePreviewData }) => {
  const FileViewer = React.useMemo(() => dynamic(() => import('react-file-viewer'), { ssr: false }), [])
  const [fileUrl, setFileUrl] = useState(null)

  useEffect(() => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!

    const fetchFile = async () => {
      try {
        const response = await fetch(filePath, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setFileUrl(url)
      } catch (error) {
        console.error('Error fetching the file:', error)
      }
    }

    fetchFile()
  }, [filePath])

  if (!['csv', 'pdf', 'xlsx', 'docx', 'mp4', 'webm', 'mp3'].includes(type)) {
  }

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto bg-slate-500 bg-opacity-35'>
      <button onClick={() => setFilePreviewData(null)} className='fixed inset-0 z-0 w-full h-full bg-transparent' />
      <div className='w-full h-full flex justify-center items-center'>
        <div className='shadow-lg max-w-3xl w-full h-full'>
          {fileUrl ? <FileViewer fileType={type} filePath={fileUrl} /> : <FallbackSpinner />}
        </div>
      </div>
    </div>
  )
}

export default FilePreview2
