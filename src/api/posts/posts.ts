// lib/api/posts.ts
// Assuming you have a common API base URL
import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import axiosInstance from 'src/api/axiosInstance'

import { Post } from 'src/types/apis' // Adjust the import path based on your project structure
import { saveDocs, saveDocsToReposisotry } from '../other'
import { repoEnum } from 'src/constants'

export const fetchPosts = async ({
  pageNumber = 0,
  pageSize = 12,
  option = null,
  main = false,
  archived = false,
  title,
  all = false
}: {
  pageSize?: number
  pageNumber?: number
  option?: string | null
  main?: boolean
  archived?: boolean
  title?: string // New parameter for filtering by title
  all?: boolean
}): Promise<Post[] | null> => {
  try {
    const params: any = {
      page: pageNumber,
      size: pageSize,
      'options.equals': option
    }

    if (main) {
      params['published.greaterThan'] = 0
    }
    if (archived) {
      params['archived.greaterThan'] = 0
    }
    if (title) {
      params['title.contains'] = title
    }

    const count = (
      await axiosInstance.get(`/api/pbf-content-posts/count`, {
        ...params
      })
    ).data

    if (all) {
      params['size'] = count
    }

    params['sort'] = 'id,desc'

    const res = await axiosInstance.get(`/api/pbf-content-posts`, {
      params
    })

    return {
      data: res.data,
      count: count
    }
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchDocuments = async ({
  pageNumber = 0,
  pageSize = 12
}: {
  pageSize: number
  pageNumber: number
}): Promise<Post[] | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-media-documents`, {
      params: {
        page: pageNumber,
        size: pageSize
      }
    })

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const fetchOnePost = async (id: number): Promise<Post | null> => {
  try {
    const res = await axiosInstance.get(`/api/pbf-content-posts/${id}`)

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}

export const createPost = async (data: any): Promise<boolean> => {
  try {
    let new_res: any = null

    // const res = await saveDocsToReposisotry({ file: data.resourceFile, repositoryTitle: repoEnum.POSTS })

    // if (res.success) {
    //   data.resourceId = res.resourceId

    new_res = await axiosInstance.post(`/api/pbf-content-posts`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // }

    const status200 = String(new_res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(error)

    return false
  }
}

export const updatePost = async (id: number, data: Post): Promise<boolean> => {
  try {
    data.id = id

    let new_res: any = null

    // const res = await saveDocsToReposisotry({ file: data.resourceFile, repositoryTitle: repoEnum.POSTS })

    // if (res.success) {
    // data.resourceId = res.resourceId

    new_res = await axiosInstance.patch(`/api/pbf-content-posts/${id}`, data)

    // }

    const status200 = String(new_res.status).startsWith('2')

    return status200
  } catch (error) {
    return false
  }
}

export const deletePost = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-content-posts/${id}`)

    const status200 = String(res.status).startsWith('2')

    return status200
  } catch (error) {
    console.error(getErrorMessage(error))

    return false
  }
}
