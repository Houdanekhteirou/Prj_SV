export interface FileOperation {
  type: 'create' | 'modify' | 'delete'
  successMessage: string
  errorMessage: string
  operation?: string
}

export const fileOperations = {
  create: {
    type: 'create',
    successMessage: 'Crée avec succès ',
    errorMessage: 'Échec de la création'
  },
  modify: {
    type: 'modify',
    successMessage: 'Modification avec succès',
    errorMessage: 'Échec de la modification'
  },
  delete: {
    type: 'delete',
    successMessage: 'Suppression avec succès',
    errorMessage: 'Échec de la suppression'
  },
  operation: 'Opération avec succès'
}

// export const translateFileOperations = (t: (key: string) => string) => {
//   // const { t } = useTranslation()

//   t(fileOperations.create.successMessage) = t(t(fileOperations.create.successMessage))
//   t(fileOperations.create.errorMessage) = t(t(fileOperations.create.errorMessage))
//   fileOperations.modify.successMessage = t(fileOperations.modify.successMessage)
//   t(fileOperations.modify.errorMessage) = t(t(fileOperations.modify.errorMessage))
//   fileOperations.delete.successMessage = t(fileOperations.delete.successMessage)
//   fileOperations.delete.errorMessage = t(fileOperations.delete.errorMessage)
// }
