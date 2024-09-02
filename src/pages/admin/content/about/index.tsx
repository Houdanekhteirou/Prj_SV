import { Box, Button, Container, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useIsFetching, useQuery } from '@tanstack/react-query'
import { set } from 'nprogress'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchWidgets, updateWidget } from 'src/api/app-widgets'
import { saveDocs } from 'src/api/other'

const AboutForm = () => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['main'],
    queryFn: async () => {
      const res = await fetchWidgets({ uid: 'about', name: 'main' })

      return res
    }
  })
  const { t, i18n } = useTranslation()
  const modeTranslation = useMemo(() => i18n.language !== 'fr', [i18n.language])

  const initialState = useMemo(() => {
    if (!data) return {}
    let main = modeTranslation ? JSON.parse(data.translations_origine)[0]['value'] : JSON.parse(data.options)
    if (!main) return {}

    return {
      title: main['title'] || '',
      description: main['description'] || '',
      imagePath: main['imagePath'] || '',
      sections: main['sections'] || [],
      cards: main['cards'] || [],
      buttonText: main['buttonText'] || '',
      impacts: main['impacts'] || { title: '', subtitle: '', cards: [], cards2: [] }
    }
  }, [data, modeTranslation])

  const [formData, setFormData] = useState(initialState)
  const [imageFiles, setImageFiles] = useState({})

  useEffect(() => {
    setFormData(initialState)
  }, [initialState])

  const handleChange = e => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleImpactsChange = e => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      impacts: {
        ...formData.impacts,
        [name]: value
      }
    })
  }

  const handleFileChange = e => {
    const { name, files } = e.target
    setImageFiles({
      ...imageFiles,
      [name]: files[0]
    })
  }

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target
    const updatedSections = formData.sections.map((section, i) =>
      i === index ? { ...section, [name]: value } : section
    )
    setFormData({
      ...formData,
      sections: updatedSections
    })
  }

  const handleCardArrayChange = (index, arrayName, arrayIndex, value) => {
    const updatedCards = formData.cards.map((card, i) => {
      if (i === index) {
        const updatedArray = card[arrayName].map((item, j) => (j === arrayIndex ? value : item))
        return { ...card, [arrayName]: updatedArray }
      }
      return card
    })
    setFormData({
      ...formData,
      cards: updatedCards
    })
  }

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: '', description: '' }]
    })
  }

  const deleteSection = index => {
    const updatedSections = formData.sections.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      sections: updatedSections
    })
  }

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { title: [''], description: [''], image: '' }]
    })
  }

  const addImpactsCard = () => {
    setFormData({
      ...formData,
      impacts: {
        ...formData.impacts,
        cards: [...formData.impacts.cards, { title: '', percentage: '', total: '', image: '' }]
      }
    })
  }

  const deleteCard = index => {
    const updatedCards = formData.cards.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      cards: updatedCards
    })
  }

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      // Upload images if any
      const imageUploadPromises = Object.keys(imageFiles).map(async key => {
        const file = imageFiles[key]
        const res = await saveDocs(file, 'img')
        if (res.success) {
          return { [key]: res.path }
        } else {
          toast.error(`Failed to upload image: ${file.name}`)

          return null
        }
      })

      const imageUploadResults = await Promise.all(imageUploadPromises)
      const uploadedImagePaths = imageUploadResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})

      const updatedFormData = {
        ...formData,
        imagePath: uploadedImagePaths['imagePath'] || formData.imagePath,
        cards: formData.cards?.map(card => ({
          ...card,
          image: uploadedImagePaths[`cardImage-${formData.cards.indexOf(card)}`] || card.image
        })),
        impacts: {
          ...formData.impacts,
          cards: formData.impacts.cards?.map(card => ({
            ...card,
            image: uploadedImagePaths[`impacts-cardImage-${formData.impacts.cards.indexOf(card)}`] || card.image
          }))
        }
      }

      const data_to_send = modeTranslation
        ? {
            translations_origine: JSON.stringify([
              {
                property: 'options',
                lang: i18n.language,
                value: updatedFormData
              }
            ])
          }
        : { options: JSON.stringify(updatedFormData) }

      const res = await updateWidget({ id: data.id, data: data_to_send })

      if (res.success) toast.success('Updated Successfully')
      else toast.error('Failed to update')
      refetch()
    },
    [updateWidget, data, formData, imageFiles, modeTranslation, refetch]
  )

  const handleImapctsCardChange = (index, name, value) => {
    const updatedCards = formData.impacts.cards.map((card, i) => (i === index ? { ...card, [name]: value } : card))
    setFormData({
      ...formData,
      impacts: {
        ...formData.impacts,
        cards: updatedCards
      }
    })
  }

  if (isLoading || isFetching) return <FallbackSpinner />

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <Typography variant='h4'>{t('About Form')}</Typography>
        </Box>
        <Box mb={4}>
          <TextField fullWidth label={t('Title')} name='title' value={formData.title} onChange={handleChange} />
        </Box>
        <Box mb={4}>
          <TextField
            fullWidth
            label={t('Description')}
            name='description'
            value={formData?.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Box>
        <Box mb={4}>
          <label
            htmlFor='imagePath-upload'
            className='w-full flex justify-center cursor-pointer border border-spacing-2 p-2 border-dashed'
          >
            {formData.imagePath ? (
              <img src={`${process.env.NEXT_PUBLIC_API_URP}/${formData.imagePath}`} alt='image' className='h-24 w-24' />
            ) : (
              <Button variant='outlined' component='span'>
                {t('Upload Image')}
              </Button>
            )}
            <input
              type='file'
              name='imagePath'
              accept='image/*'
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id='imagePath-upload'
            />
          </label>
        </Box>
        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>{t('Sections')}</Typography>
          {formData.sections?.map((section, index) => (
            <div key={index} className='bg-slate-500 p-4 bg-opacity-5'>
              <IconButton
                onClick={() => deleteSection(index)}
                color='secondary'
                aria-label='delete'
                className='self-end justify-end'
              >
                <IconifyIcon icon='mdi:delete-outline' color='red' />
              </IconButton>
              <TextField
                fullWidth
                label={t('Section Title')}
                name='title'
                value={section.title}
                onChange={e => handleSectionChange(index, e)}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label={t('Section Description')}
                name='description'
                value={section.description}
                onChange={e => handleSectionChange(index, e)}
                multiline
                rows={4}
              />
            </div>
          ))}
          <div className='self-end'>
            <Button variant='outlined' color='primary' onClick={addSection} size='medium'>
              {t('Add Section')}
            </Button>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>{t('Cards')}</Typography>
          {formData.cards?.map((card, index) => (
            <div key={index} className='bg-slate-500 p-4 bg-opacity-5'>
              <IconButton onClick={() => deleteCard(index)} color='secondary' aria-label='delete'>
                <IconifyIcon icon='mdi:delete-outline' color='red' />
              </IconButton>
              <Grid container spacing={2}>
                {card.title.map((title, i) => (
                  <Grid item xs={6} key={i}>
                    <TextField
                      fullWidth
                      label={t(`Card Title ${i + 1}`)}
                      value={title}
                      onChange={e => handleCardArrayChange(index, 'title', i, e.target.value)}
                    />
                  </Grid>
                ))}
                {card.description.map((desc, i) => (
                  <Grid item xs={6} key={i}>
                    <TextField
                      fullWidth
                      label={t(`Card Description ${i + 1}`)}
                      value={desc}
                      onChange={e => handleCardArrayChange(index, 'description', i, e.target.value)}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <label
                    htmlFor={`cardImage-upload-${index}`}
                    className='w-full flex justify-center cursor-pointer border border-spacing-2 p-2 border-dashed'
                  >
                    {imageFiles[`cardImage-${index}`] ? (
                      <img
                        src={URL.createObjectURL(imageFiles[`cardImage-${index}`])}
                        alt='card image'
                        className='h-24 w-24'
                      />
                    ) : card.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URP}/${card.image}`}
                        alt='card image'
                        className='h-24 w-24'
                      />
                    ) : (
                      // show the selcted image
                      <Button variant='outlined' component='span'>
                        {t('Upload Image')}
                      </Button>
                    )}

                    <input
                      type='file'
                      name={`cardImage-${index}`}
                      accept='image/*'
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id={`cardImage-upload-${index}`}
                    />
                  </label>
                </Grid>
              </Grid>
            </div>
          ))}
          <div className='self-end'>
            <Button variant='outlined' color='primary' onClick={addCard}>
              {t('Add Card')}
            </Button>
          </div>
        </div>
        <Box my={4}>
          <TextField
            fullWidth
            label={t('Button Text')}
            name='buttonText'
            value={formData.buttonText}
            onChange={handleChange}
          />
        </Box>

        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>{t('Impacts')}</Typography>
          <Box mb={4}>
            <TextField
              fullWidth
              label={t('Impacts Title')}
              name='title'
              value={formData.impacts?.title}
              onChange={handleImpactsChange}
            />
          </Box>
          <Box mb={4}>
            <TextField
              fullWidth
              label={t('Impacts Subtitle')}
              name='subtitle'
              value={formData.impacts?.subtitle}
              onChange={handleImpactsChange}
            />
          </Box>
          <Typography variant='h6'>{t('Impacts Cards')}</Typography>
          {formData.impacts?.cards?.map((card, index) => (
            <div key={index} className='bg-slate-500 p-4 bg-opacity-5'>
              <IconButton onClick={() => deleteCard(index, 'impacts.cards')} color='secondary' aria-label='delete'>
                <IconifyIcon icon='mdi:delete-outline' color='red' />
              </IconButton>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('Card Title')}
                    value={card.title}
                    onChange={e => handleImapctsCardChange(index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('Card Percentage')}
                    value={card.percentage}
                    onChange={e => handleImapctsCardChange(index, 'percentage', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('Card Total')}
                    value={card.total}
                    onChange={e => handleImapctsCardChange(index, 'total', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <label
                    htmlFor={`cardImage-impacts-upload-${index}`}
                    className='w-full flex justify-center cursor-pointer border border-spacing-2 p-2 border-dashed'
                  >
                    {imageFiles[`impacts-cardImage-${index}`] ? (
                      <img
                        src={URL.createObjectURL(imageFiles[`impacts-cardImage-${index}`])}
                        alt='card image'
                        className='h-14'
                      />
                    ) : card.image ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URP}/${card.image}`} alt='card image' className='h-14' />
                    ) : (
                      <Button variant='outlined' component='span'>
                        {t('Upload Image')}
                      </Button>
                    )}
                    <input
                      type='file'
                      name={`impacts-cardImage-${index}`}
                      accept='image/*'
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id={`cardImage-impacts-upload-${index}`}
                    />
                  </label>
                </Grid>
              </Grid>
            </div>
          ))}
          <div className='self-end'>
            <Button variant='outlined' color='primary' size='medium' onClick={() => addImpactsCard()}>
              {t('Add Card')}
            </Button>
          </div>
        </div>
        <div className='self-end'>
          <Button type='submit' variant='contained' color='primary' size='medium'>
            {t('Submit')}
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default AboutForm
