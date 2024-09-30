import { getErrorMessage } from 'src/@core/utils/getErrorMessage'

import { Project } from 'src/types/apis'

import axiosInstance from 'src/api/axiosInstance'
import axios from 'axios'

export const fetchAllProjects = async (): Promise<Project[] | null> => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW1lQGdtYWlsLmNvbSIsImlhdCI6MTcyNzY5NjQwOCwiZXhwIjoyNTMzOTQzMDc2MDh9.6sF_Iuw4E25vnZzN0djIwrnfYjcQGtgrAM_RA4YPST0' // Replace this with your actual token
    const res = await axiosInstance.get('/projets')

    return res.data
  } catch (error) {
    console.error(error)

    return null
  }
}
