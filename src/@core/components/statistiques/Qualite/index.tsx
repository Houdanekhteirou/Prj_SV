'use client'

import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { fetchElements } from 'src/api/data/element'
import { filterEntities, filterZone } from 'src/api/other'
import { getGraphData, getTableData } from 'src/api/statistique'
import FallbackSpinner from '../../spinner'
import { ChartStats } from '../charts'
import TableStats from '../tables'

const agregations = [
  { value: 0, label: 'Hopitaux' },
  { value: 1, label: 'Centres de santé' },
  { value: 2, label: 'Postes de santé (Principaux)' },
  { value: 3, label: 'Poste de santé (sécondaires)' },
  { value: 4, label: 'Tous les postes de santé' }
]

const QualiteStatistiques = () => {
  const { t } = useTranslation()

  const [filterData, setFilterData] = useState<any>({
    elements: [],
    localites: [],
    periods: [],
    visualizations: []
  })

  const [tableData, setTableData] = useState(null)
  const [graphData, setGraphData] = useState(null)
  const [tableDataValueTypes, setTableDataValueTypes] = useState(1)
  const [graphDataValueTypes, setGraphDataValueTypes] = useState(1)
  const [allowFetch, setAllowFetch] = useState(false)

  const [indicator, setIndicator] = useState('')
  const [agregation, setAgregation] = useState('')
  const [region, setRegion] = useState('')
  const [departement, setDepartement] = useState('')
  const [aireSante, setAireSante] = useState('')
  const [formationSanitaire, setFormationSanitaire] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [visualizationModel, setVisualizationModel] = useState('')

  const {
    data: allIndicators,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['elements'],
    queryFn: async () => {
      const res = await fetchElements({ all: true, units: 28 })

      return res?.data?.object
    }
  })

  const { data: allRegions, isLoading: isLoadingRegions } = useQuery({
    queryKey: ['wilaya'],
    queryFn: async () => {
      const res = await filterZone(1)

      return res?.data
    }
  })

  const { data: allDepartements, isLoading: isLoadingDepartements } = useQuery({
    queryKey: ['moughataa', region],
    queryFn: async () => {
      const res = await filterZone(region)

      return res?.data
    },
    enabled: !!region
  })

  const { data: allZoneSanitaire, isLoading: isLoadingZoneSanitaire } = useQuery({
    queryKey: ['zoneSanitaire', departement],
    queryFn: async () => {
      const res = await filterZone(departement)

      return res?.data
    },
    enabled: !!departement
  })

  const { data: allEntities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities', aireSante],
    queryFn: async () => {
      const res = await filterEntities(aireSante)

      return res?.data
    },
    enabled: !!aireSante
  })

  const createFilter = () => {
    const filter = {
      elements: filterData.elements.map(el => ({
        id: el.id,
        type: el.type,
        aggregation: +el.aggregation
      })),
      localites: filterData.localites.map(el => ({
        id: el.id,
        type: el.type
      })),
      periods: filterData.periods.map(el => ({
        startDate: new Date(el.startDate).toISOString().split('T')[0],
        endDate: new Date(el.endDate).toISOString().split('T')[0]
      }))
    }

    return filter
  }

  const shouldFetchData = () => {
    if (!filterData.elements.length || !filterData.localites.length || !filterData.periods.length) return false

    return true
  }

  const { data: tableDataResponse, isLoading: isLoadingTableData } = useQuery({
    queryKey: ['tableData', filterData, tableDataValueTypes],
    queryFn: async () => {
      const filter = createFilter()
      const res = await getTableData({ filterData: { ...filter, valueType: tableDataValueTypes, page: 2 } })

      return res?.data
    },
    enabled: shouldFetchData()
  })

  const { data: graphDataResponse, isLoading: isLoadingGraphData } = useQuery({
    queryKey: ['graphData', filterData, graphDataValueTypes],
    queryFn: async () => {
      const filter = createFilter()
      const res = await getGraphData({ filterData: { ...filter, valueType: graphDataValueTypes, page: 2 } })

      return res?.data
    },
    enabled: shouldFetchData()
  })

  useEffect(() => {
    if (tableDataResponse) {
      setTableData(tableDataResponse)
    }
  }, [tableDataResponse])

  useEffect(() => {
    if (graphDataResponse) {
      setGraphData(graphDataResponse)
    } else {
      setGraphData(null)
    }
  }, [graphDataResponse])

  // ** Add Indicator

  const handleAddIndicator = () => {
    if (!indicator || !agregation) {
      window.alert('Veuillez remplir tous les champs')

      return
    }

    const isAlreadyAdded = filterData.elements.some(el => el.id === indicator && +el.aggregation === +agregation)

    if (isAlreadyAdded) {
      window.alert('Cet indicateur est déjà ajouté avec la même agrégation')

      return
    }

    setFilterData({
      ...filterData,
      elements: [
        ...filterData.elements,
        {
          id: indicator,
          type: 1,
          aggregation: agregation,
          title:
            allIndicators?.find(el => el.id === indicator)?.title +
            ' - ' +
            agregations.find(el => el.value === +agregation)?.label
        }
      ]
    })
  }

  const handleAddLocation = () => {
    if (!region && !departement && !aireSante && !formationSanitaire) {
      window.alert('Veuillez remplir tous les champs')

      return
    }

    const isAlreadyAdded = filterData.localites.some(
      el =>
        el.id === (formationSanitaire ? formationSanitaire : aireSante ? aireSante : departement ? departement : region)
    )

    if (isAlreadyAdded) {
      window.alert('Cette localisation est déjà ajoutée')

      return
    }

    setFilterData({
      ...filterData,
      localites: [
        ...filterData.localites,
        {
          id: formationSanitaire ? formationSanitaire : aireSante ? aireSante : departement ? departement : region,
          type: formationSanitaire ? 4 : aireSante ? 3 : departement ? 2 : region ? 1 : 0,
          title: formationSanitaire
            ? allEntities?.find(el => el.id === formationSanitaire)?.name
            : aireSante
            ? allZoneSanitaire?.find(el => el.id === aireSante)?.name
            : departement
            ? allDepartements?.find(el => el.id === departement)?.name
            : region
            ? allRegions?.find(el => el.id === region)?.name
            : ''
        }
      ]
    })
  }

  const handleAddPeriod = () => {
    if (!periodStart || !periodEnd) {
      window.alert('Veuillez remplir tous les champs')
      return
    }
    setFilterData({
      ...filterData,
      periods: [
        ...filterData.periods,
        {
          startDate: periodStart,
          endDate: periodEnd,
          title: `${new Date(periodStart).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })} - ${new Date(periodEnd).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}`
        }
      ]
    })
    setPeriodStart('')
    setPeriodEnd('')
  }

  const handleAddVisualization = () => {
    setFilterData({
      ...filterData,
      visualizations: [...filterData.visualizations, visualizationModel]
    })
  }

  const handleRemoveIndicator = index => {
    setFilterData({
      ...filterData,
      elements: filterData.elements.filter((_, i) => i !== index)
    })
  }

  const handleRemoveLocation = index => {
    setFilterData({
      ...filterData,
      localites: filterData.localites.filter((_, i) => i !== index)
    })
  }

  const handleRemovePeriod = index => {
    setFilterData({
      ...filterData,
      periods: filterData.periods.filter((_, i) => i !== index)
    })
  }

  const handleActiveFetch = () => {
    if (shouldFetchData()) {
      setAllowFetch(true)
    }
  }

  const renderContent = () => {
    if (!allowFetch) {
      return <></>
    }
    if (!isLoadingGraphData || !isLoadingTableData) {
      return <FallbackSpinner />
    }

    return (
      <>
        <ChartStats
          key={1}
          data={graphData}
          graphDataValueTypes={graphDataValueTypes}
          setGraphDataValueTypes={setGraphDataValueTypes}
          valueTypes={[
            { value: 1, title: t('ENTITÉS ADMINISTRATIVES') },
            { value: 2, title: t('FORMATIONS SANITAIRES') },
            { value: 3, title: t('ENTITÉS COMMUNAUTAIRES') }
          ]}
        />
        <TableStats
          key={2}
          data={tableData}
          setTableDataValueTypes={setTableDataValueTypes}
          tableDataValueTypes={tableDataValueTypes}
          valueTypes={[
            { value: 1, title: t('ENTITÉS ADMINISTRATIVES') },
            { value: 2, title: t('FORMATIONS SANITAIRES') },
            { value: 3, title: t('ENTITÉS COMMUNAUTAIRES') }
          ]}
        />
      </>
    )
  }

  return (
    <div>
      <div className='flex flex-col lg:flex-row justify-start p-6 lg:p-10 gap-6 lg:gap-10'>
        <div className='flex flex-col gap-6 lg:gap-10 w-full lg:w-1/3 justify-between'>
          <div className='flex gap-6 lg:gap-10 flex-col'>
            <div className='flex gap-2 items-center'>
              <img src='/about/checking.svg' alt='checking' width={60} />
              <Typography
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: '#4D4D4D'
                }}
              >
                {t('Indicateurs')}
              </Typography>
            </div>
            <div className='flex gap-2 items-center flex-wrap'>
              {filterData?.elements?.map((element: any, index: number) => (
                <p
                  key={index}
                  className='rounded-full p-2 sm:p-4 flex items-center gap-4'
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    backgroundColor: '#01A753'
                  }}
                >
                  {element.title}
                  <IconifyIcon
                    icon='fa-solid:times'
                    className='text-white'
                    style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                    onClick={() => handleRemoveIndicator(index)}
                  />
                </p>
              ))}
            </div>
          </div>

          <div className='flex gap-6 lg:gap-10 flex-col'>
            <div className='flex gap-2 items-center'>
              <img src='/about/map-marker.svg' alt='map-marker' width={60} />
              <Typography
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: '#4D4D4D'
                }}
              >
                {t('Localisations')}
              </Typography>
            </div>
            <div className='flex gap-2 items-center flex-wrap'>
              {filterData?.localites?.map((localite: any, index: number) => (
                <p
                  key={index}
                  className='rounded-full p-2 sm:p-4 flex items-center gap-4'
                  style={{
                    color: 'black',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    backgroundColor: '#FDED22'
                  }}
                >
                  {localite.title}
                  <IconifyIcon
                    icon='fa-solid:times'
                    className='text-black'
                    style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                    onClick={() => handleRemoveLocation(index)}
                  />
                </p>
              ))}
            </div>
          </div>

          <div className='flex gap-6 lg:gap-10 flex-col'>
            <div className='flex gap-2 items-center'>
              <img src='/about/calendar.svg' alt='map-marker' width={60} />
              <Typography
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: '#4D4D4D'
                }}
              >
                {t('Périodes')}
              </Typography>
            </div>
            <div className='flex gap-2 items-center flex-wrap'>
              {filterData?.periods?.map((period: any, index: number) => (
                <p
                  key={index}
                  className='rounded-full p-2 sm:p-4 flex items-center gap-4'
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    backgroundColor: '#CE2026'
                  }}
                >
                  {period.title}
                  <IconifyIcon
                    icon='fa-solid:times'
                    className='text-white'
                    style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                    onClick={() => handleRemovePeriod(index)}
                  />
                </p>
              ))}
            </div>
          </div>
        </div>
        {/* section filter  */}
        <div className='flex flex-col gap-6 lg:gap-10 w-full lg:w-2/3 px-6 lg:px-10'>
          <div className=''>
            <Typography
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#4D4D4D',
                alignSelf: 'center'
              }}
            >
              {t('CHOISIR UN ENSEMBLE DE DONNÉES')}
            </Typography>
            <hr className='self-end w-32 md:w-48 h-1.5 bg-red-600' />
          </div>
          <div>
            <FormControl fullWidth>
              <Autocomplete
                id='combo-box-demo'
                options={
                  allIndicators?.map((indicator: any) => ({
                    id: indicator.id,
                    title: indicator.title
                  })) || []
                }
                getOptionLabel={option => option.title}
                onChange={(e, value) => setIndicator(value?.id)}
                renderInput={params => <TextField {...params} variant='standard' label={t('Choisir un indicateur')} />}
              />
            </FormControl>
          </div>
          <div className=''>
            <FormControl>
              <FormLabel id='demo-row-radio-buttons-group-label'>{t('AGREGATION')}</FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={agregation}
                onChange={e => setAgregation(e.target.value)}
              >
                {agregations.map((agregation: any) => (
                  <FormControlLabel
                    key={agregation.value}
                    value={agregation.value}
                    control={<Radio />}
                    label={t(agregation.label)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Button
              variant='contained'
              color='primary'
              sx={{ mt: 4, float: 'right', pt: '1%', pb: '1%', pl: '4%', pr: '4%' }}
              onClick={handleAddIndicator}
            >
              {t('AJOUTER UN INDICATEUR')}
            </Button>
          </div>

          <hr className='w-full   bg-gray-400' />
          <div className='flex flex-col gap-6'>
            <Typography className='text-gray-400' fontWeight='bold'>
              {t('LIEU : ZONE/ FORMATION SANITAIRE')}
            </Typography>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col md:flex-row gap-1'>
                <FormControl className='md:fullWidth' sx={{ width: '80%' }}>
                  <InputLabel id='indicateur-select'>{t('Choisir une region')}</InputLabel>
                  <Select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    id='select-indicateur'
                    labelId='indicateur-select'
                    size='medium'
                    variant='standard'
                    className='md:fullWidth'
                    sx={{
                      borderBottom: '2.5px solid #01A753',
                      width: '80%'
                    }}
                    IconComponent={() => <IconifyIcon icon='fa-solid:chevron-down' color='#01A753' />}
                  >
                    <MenuItem value={''}>{t('None')}</MenuItem>
                    {allRegions?.map((region: any) => (
                      <MenuItem key={region.id} value={region.id}>
                        {region.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className='md:fullWidth' sx={{ width: '80%' }}>
                  <InputLabel id='indicateur-select'>{t('Choisir un departement')}</InputLabel>
                  <Select
                    id='select-indicateur'
                    labelId='indicateur-select'
                    size='medium'
                    variant='standard'
                    value={departement}
                    onChange={e => setDepartement(e.target.value)}
                    className='md:fullWidth'
                    sx={{
                      borderBottom: '2.5px solid #01A753',
                      width: '80%'
                    }}
                    IconComponent={() => <IconifyIcon icon='fa-solid:chevron-down' color='#01A753' />}
                  >
                    <MenuItem value={''}>{t('None')}</MenuItem>
                    {allDepartements?.map((departement: any) => (
                      <MenuItem key={departement.id} value={departement.id}>
                        {departement.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormControl className='md:fullWidth' sx={{ width: '80%' }}>
                  <InputLabel id='indicateur-select'>{t('Choisir une aire de sante')}</InputLabel>
                  <Select
                    id='select-indicateur'
                    labelId='indicateur-select'
                    size='medium'
                    variant='standard'
                    value={aireSante}
                    onChange={e => setAireSante(e.target.value)}
                    className='md:fullWidth'
                    sx={{
                      borderBottom: '2.5px solid #01A753',
                      width: '80%'
                    }}
                    IconComponent={() => <IconifyIcon icon='fa-solid:chevron-down' color='#01A753' />}
                  >
                    <MenuItem value={''}>{t('None')}</MenuItem>
                    {allZoneSanitaire?.map((zone: any) => (
                      <MenuItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className='md:fullWidth' sx={{ width: '80%' }}>
                  <InputLabel id='indicateur-select'>{t('Choisir une formation sanitaire')}</InputLabel>
                  <Select
                    id='select-indicateur'
                    labelId='indicateur-select'
                    size='medium'
                    variant='standard'
                    value={formationSanitaire}
                    onChange={e => setFormationSanitaire(e.target.value)}
                    className='md:fullWidth'
                    sx={{
                      borderBottom: '2.5px solid #01A753',
                      width: '80%'
                    }}
                    IconComponent={() => <IconifyIcon icon='fa-solid:chevron-down' color='#01A753' />}
                  >
                    <MenuItem value={''}>{t('None')}</MenuItem>
                    {allEntities?.map((entity: any) => (
                      <MenuItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <Button
              variant='contained'
              color='primary'
              sx={{ mt: 4, float: 'right', pt: '1%', pb: '1%', pl: '4%', pr: '4%' }}
              onClick={handleAddLocation}
            >
              {t('AJOUTER UNE LOCALISATION')}
            </Button>
          </div>
          <hr className='w-full bg-gray-400' />
          <div className=''>
            <Typography className='text-gray-400' fontWeight='bold'>
              {t('PÉRIODE')}
            </Typography>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col md:flex-row gap-1'>
                <FormControl sx={{ width: '80%' }}>
                  <TextField
                    label={t('Date de début')}
                    variant='standard'
                    id='date'
                    type='date'
                    sx={{
                      borderBottom: '2.5px solid #01A753',
                      width: '80%'
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={e => setPeriodStart(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ width: '80%' }}>
                  <TextField
                    label={t('Date de fin')}
                    variant='standard'
                    id='date'
                    type='date'
                    sx={{
                      borderBottom: '2.5px solid #01A753',
                      width: '80%'
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={e => setPeriodEnd(e.target.value)}
                  />
                </FormControl>
              </div>
            </div>
            <Button
              variant='contained'
              color='primary'
              sx={{ mt: 4, float: 'right', pt: '1%', pb: '1%', pl: '4%', pr: '4%' }}
              onClick={handleAddPeriod}
            >
              {t('AJOUTER UNE PÉRIODE')}
            </Button>
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Button variant='contained' color='primary' className='self-end w-72' onClick={() => handleActiveFetch()}>
              {t('Visualiser les données')}
            </Button>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  )
}

export default QualiteStatistiques
