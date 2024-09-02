export const TElement = [
  { name: 'name', type: 'text', labels: { en: 'Name', ar: 'الاسم' } },
  {
    name: 'description',
    type: 'text',
    labels: { en: 'Description', ar: 'الوصف' }
  },
  {
    name: 'shortname',
    type: 'text',
    labels: { en: 'Shortname', ar: 'الاسم المختصر' }
  },
  {
    name: 'formName',
    type: 'text',
    labels: { en: 'Form Name', ar: 'اسم النموذج' }
  }
]

export const TFileType = [
  // { name: "name", type: "text", labels: { en: "Nom", ar: "اسم" } },
  { name: 'title', type: 'text', labels: { en: 'Titre', ar: 'العنوان' } },
  { name: 'uid', type: 'text', labels: { en: 'Title Pub', ar: 'الإسم العام' } }
]

export const TRole = [
  { name: 'name', type: 'text', labels: { en: 'Name', ar: 'الاسم' } },
  {
    name: 'description',
    type: 'text',
    labels: { en: 'Description', ar: 'الوصف' }
  }
]

export const TGroup = [
  { name: 'name', type: 'text', labels: { en: 'Name', ar: 'الاسم' } },
  {
    name: 'description',
    type: 'text',
    labels: { en: 'Description', ar: 'الوصف' }
  }
]

export const TentityClass = [{ name: 'name', type: 'text', labels: { en: 'Name', ar: 'الاسم' } }]

export const TreportType = [
  { name: 'name', type: 'text', labels: { en: 'Name', ar: 'الاسم' } },
  { name: 'description', type: 'text', labels: { en: 'Description', ar: 'الوصف' } }
]

export const TAccount = [{ name: 'name', type: 'text', labels: { en: 'Name', ar: 'الاسم' } }]

export const TFileDataEntry = [
  {
    name: 'description',
    type: 'text',
    labels: { en: 'Description', ar: 'الوصف' }
  }
]

export const TPosts = [
  { name: 'title', type: 'text', labels: { en: 'Title', ar: 'العنوان' } },
  {
    name: 'content',
    type: 'textarea',
    labels: { en: 'Content', ar: 'المحتوى' }
  },
  // author and author occupation
  {
    name: 'author',
    type: 'text',
    labels: { en: 'Author', ar: 'الكاتب' }
  },
  {
    name: 'authorFunction',
    type: 'text',
    labels: { en: 'Author Occupation', ar: 'وظيفة الكاتب' }
  }
]
