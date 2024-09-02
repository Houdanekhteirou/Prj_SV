import axiosInstance from '../axiosInstance'

// /api/pbf-media-repositories/explorer

export const fetchPbfMediaRepositories = async () => {
  try {
    const count_repo = (await axiosInstance.get(`/api/pbf-media-repositories/count`)).data

    const count_resources = (await axiosInstance.get(`/api/pbf-media-resources/count`)).data

    const repos = await axiosInstance.get('/api/pbf-media-repositories', {
      params: {
        size: count_repo
      }
    })
    const resources = await axiosInstance.get('/api/pbf-media-resources', {
      params: {
        size: count_resources
      }
    })

    return structureResponses(repos.data, resources.data)
  } catch (error) {
    throw error
  }
}

export const createPbfMediaRepositorie = async data => {
  try {
    const repos = await axiosInstance.post('/api/pbf-media-repositories', data)

    return repos.data
  } catch (error) {
    throw error
  }
}

export const updatePbfMediaRepositorie = async (id, data) => {
  try {
    const repos = await axiosInstance.patch(`/api/pbf-media-repositories/${id}`, data)

    return repos.data
  } catch (error) {
    throw error
  }
}

export const updatePbfMediaResource = async (id, data) => {
  try {
    const repos = await axiosInstance.patch(`/api/pbf-media-resources/${id}`, data)

    return repos.data
  } catch (error) {
    throw error
  }
}

export const deletePbfMediaRepositorie = async id => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-media-repositories/${id}`)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deletePbfMediaResource = async id => {
  try {
    const res = await axiosInstance.delete(`/api/pbf-media-resources/${id}`)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchPbfMediaRepositoryByTitle = async title => {
  try {
    const res = await axiosInstance.get('/api/pbf-media-repositories/by-title', {
      params: {
        title
      }
    })

    return structureResponses2(res.data)
  } catch (error) {
    throw error
  }
}

function structureResponses(foldersResponse, filesResponse) {
  const rootFolderId = '1' // Assuming a root folder ID, you can change it as needed

  const fileMap = {}
  console.log(foldersResponse)
  console.log(filesResponse)

  foldersResponse.forEach(folder => {
    const folderId = folder.id.toString()
    const parentId = folder.parentId.toString()

    if (!fileMap[parentId]) {
      fileMap[parentId] = {
        id: '1',
        name: `root`,
        isDir: true,
        childrenIds: [],
        childrenCount: 0
      }
    }

    fileMap[folderId] = {
      id: folderId,
      name: folder.name,
      isDir: true,
      childrenIds: [],
      childrenCount: 0,
      parentId: parentId
    }

    fileMap[parentId].childrenIds.push(folderId)
    fileMap[parentId].childrenCount++
  })

  console.log('fileMap1', fileMap)
  filesResponse.forEach((file, i) => {
    const fileId = file.id.toString()
    const parentId = file.repositoryId.toString()
    console.log('parentId', parentId)

    if (!fileMap[parentId]) {
      fileMap[parentId] = {
        id: parentId,
        name: `Repository ${parentId}`,
        isDir: true,
        childrenIds: [],
        childrenCount: 0
      }
    }

    fileMap[fileId] = {
      id: fileId,
      name: file.filename,
      isDir: false
    }

    fileMap[parentId].childrenIds.push(fileId)
    fileMap[parentId].childrenCount++
  })

  return {
    rootFolderId,
    fileMap
  }
}

function structureResponses2(repo) {
  const rootFolderId = repo.id // Assuming a root folder ID, you can change it as needed

  const fileMap = {}

  repo.children.forEach(folder => {
    const folderId = folder.id.toString()
    const parentId = folder.parentId.toString()

    if (!fileMap[parentId]) {
      fileMap[parentId] = {
        id: repo.id,
        name: repo.title,
        isDir: true,
        childrenIds: [],
        childrenCount: 0
      }
    }

    fileMap[folderId] = {
      id: folderId,
      name: folder.title,
      isDir: true,
      childrenIds: [],
      childrenCount: 0,
      parentId: parentId
    }

    fileMap[parentId].childrenIds.push(folderId)
    fileMap[parentId].childrenCount++
  })

  repo.resources.forEach((file, i) => {
    const fileId = file.id.toString()
    const parentId = file.repositoryId.toString()

    if (!fileMap[parentId]) {
      fileMap[parentId] = {
        id: parentId,
        name: `Repository ${parentId}`,
        isDir: true,
        childrenIds: [],
        childrenCount: 0
      }
    }

    fileMap[fileId] = {
      id: fileId,
      name: file.filename,
      isDir: false
    }

    fileMap[parentId].childrenIds.push(fileId)
    fileMap[parentId].childrenCount++
  })

  console.log('fileMap2', fileMap)

  return {
    rootFolderId,
    fileMap
  }
}
