import { Button, FormControl, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import { fetchRealTimeIndicators } from 'src/api/other'
import { formatNumber, mapMonthsToTrimesters, years } from '../utils'
import IconifyIcon from './icon'
import { get_entity, get_real_time_data, get_zone } from 'src/api/select_filters'

const getMonthAfter = (month: number, year: number) => {
  if (month === 12) {
    return { month: 1, year: year - 1 }
  }

  return { month: month - 1, year }
}

const QualiteRealTime = ({ allWilaya }) => {
  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)

  const [mont1, setMont1] = useState(1)
  const [mont2, setMont2] = useState(3)
  const [year1, setYear1] = useState(2024)
  const [year2, setYear2] = useState(2024)

  const [subItems, setSubItems] = useState({
    index: null,
    data: null,
    show: false
  })

  const [zoneId, setZoneId] = useState('')

  const { t } = useTranslation()

  const {
    data,
    isLoading,
    error,
    refetch: refRealTime
  } = useQuery({
    queryKey: ['realtime_indicators', mont1, year1, zoneId, year2, mont2],
    queryFn: async () => {
      const res = await get_real_time_data({
        fromMonth: mont1,
        fromYear: year1,
        toMonth: mont2,
        toYear: year2
        // zoneId: zoneId
      })

      // change the total icon
      return res
    }
  })

  const { data: allMoughataa } = useQuery({
    queryKey: ['moughataa_real_time', wilaya],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 4,
        parentId: wilaya
      })

      return res
    },
    enabled: !!wilaya
  })

  const { data: allZoneSanitaire } = useQuery({
    queryKey: ['zoneSanitaire_real_time', moughataa],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 5,
        parentId: moughataa
      })

      return res
    },
    enabled: !!moughataa
  })

  // const { data: allEntities, isLoading: isLoadingEntities } = useQuery({
  //   queryKey: ['entities_real_time', zoneSanitaire],
  //   queryFn: async () => {
  //     const res = await get_entity({
  //       zoneId: zoneSanitaire,
  //       entityclassId: 1
  //     })

  //     return res
  //   },
  //   enabled: !!zoneSanitaire
  // })

  const months = mapMonthsToTrimesters(Array.from({ length: 12 }, (_, i) => i + 1))

  // Function to toggle display of subitems
  const toggleSubItems = (index: number) => {
    if (subItems.index === index) {
      setSubItems(prevState => ({
        ...prevState,
        show: !prevState.show
      }))
    } else {
      setSubItems({
        index: index,
        show: true,
        data: data?.items[index]?.subItems
      })
    }
  }

  return (
    <div className='sm:p-4 p-1 '>
      <Typography variant='h5' color={'primary'}>
        {t('Indicateurs quantitatifs')}
      </Typography>
      <header className='grid grid-cols-1 md:grid-cols-2 gap-4  p-0 lg:p-4 mb-4'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-2 place-self-center w-full  '>
          <Button
            variant='text'
            color='primary'
            onClick={() => {
              if (mont === null || year === null) return
              refRealTime()
            }}
          >
            {t('Evolution')}
          </Button>

          <div className='col-span-2 flex-grow flex gap-2 '>
            <FormControl fullWidth>
              <InputLabel id='month-select'>{t('Mois')}</InputLabel>
              <Select
                name='month'
                value={mont1}
                onChange={e => {
                  setMont1(e.target.value)
                }}
                variant='standard'
              >
                {months.map((el, index) => (
                  <MenuItem key={index} value={el.value}>
                    {t(el.label)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id='year-select'>{t('Année')}</InputLabel>
              <Select
                variant='standard'
                value={year1}
                onChange={e => {
                  setYear1(e.target.value)
                }}
              >
                {years.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='place-self-center	'>{t('à')}</div>
          <div className='col-span-2 w-full flex  '>
            <FormControl fullWidth>
              <InputLabel id='month-select'>{t('Mois')}</InputLabel>
              <Select
                name='month'
                value={mont2}
                onChange={e => {
                  setMont2(e.target.value)
                }}
                variant='standard'
              >
                {months.map((el, index) => (
                  <MenuItem key={index} value={el.value}>
                    {t(el.label)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id='year-select'>{t('Année')}</InputLabel>
              <Select
                variant='standard'
                value={year2}
                onChange={e => {
                  setYear2(e.target.value)
                }}
              >
                {years.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='flex flex-grow'>
          <FormControl fullWidth>
            <InputLabel id='wilayaa-select'>{t('Wilayaas')}</InputLabel>
            <Select
              fullWidth
              value={wilaya}
              id='select-wilayaa'
              label='Select Wilayaa'
              labelId='wilayaa-select'
              size='medium'
              variant='standard'
              onChange={e => {
                setWilaya(e.target.value)
                setMoughataa(null)
                setZoneSanitaire(null)
                setZoneId(e.target.value)
              }}
              inputProps={{ placeholder: 'Select Wilayaa' }}
            >
              <MenuItem value={''}>{t('None')}</MenuItem>
              {allWilaya?.map(wilaya => (
                <MenuItem key={wilaya.value} value={wilaya.id}>
                  {t(wilaya.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id='moughataa-select'>{t('Moughataas')}</InputLabel>
            <Select
              fullWidth
              value={moughataa}
              id='select-moughataa'
              label='Select Moughataa'
              labelId='moughataa-select'
              // add none option

              onChange={e => {
                setMoughataa(e.target.value)
                setZoneSanitaire(null)
                setZoneId(e.target.value)
              }}
              variant='standard'
              inputProps={{ placeholder: 'Select Moughataa' }}
            >
              <MenuItem value={''}>{t('None')}</MenuItem>
              {allMoughataa?.map(moughataa => (
                <MenuItem key={moughataa.id} value={moughataa.id}>
                  {t(moughataa.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='zone-select'>{t('Aires sanitaires')}</InputLabel>
            <Select
              fullWidth
              value={zoneSanitaire}
              id='select-zone'
              label='Select Zone'
              labelId='zone-select'
              onChange={e => {
                setZoneSanitaire(e.target.value)
                setZoneId(e.target.value)
              }}
              variant='standard'
              inputProps={{ placeholder: 'Select Zone' }}
            >
              <MenuItem value={null}>{t('None')}</MenuItem>
              {allZoneSanitaire?.map(zoneSanitaire => (
                <MenuItem key={zoneSanitaire.id} value={zoneSanitaire.id}>
                  {t(zoneSanitaire.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <FormControl fullWidth>
            <InputLabel id='role-select'>{t('Formations Sanitaires')}</InputLabel>
            <Select
              fullWidth
              value={entity}
              id='select-entity'
              label='Select Entity'
              labelId='entity-select'
              onChange={e => setEntity(e.target.value)}
              inputProps={{ placeholder: 'Select Entity' }}
              variant='standard'
            >
              <MenuItem value={null}>{t('Sélectionner')}</MenuItem>
              {allEntities?.map(entity => (
                <MenuItem key={entity.id} value={entity.id}>
                  {t(entity.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </div>
      </header>
      <div className='flex flex-col justify-center gap-4'>
        {RenderQualite({ data, isLoading, error, t, toggleSubItems, subItems })}
        <div className='self-center'>
          <Link href='/stats/?page=quantite' passHref>
            <Button variant='outlined' color='primary'>
              {t('Voir plus')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const RenderQualite = ({ data, isLoading, error, t, toggleSubItems, subItems }: any) => {
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center'>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} variant='rounded' width={200} height={200} />
        ))}
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center'>
      {' '}
      {data?.items
        // inverse the array to have the total at the end
        .slice(0)
        .reverse()
        .map((el, index) => (
          <CardQunatite
            key={index}
            index={index}
            isUp={el.changePercentage >= 0 ? true : false}
            title={el.title}
            value={formatNumber(el.value) || '0.0'}
            pourcentage={el.changePercentage}
            image={`${process.env.NEXT_PUBLIC_API_URP}/${el.icon}`}
            toggleSubItems={toggleSubItems}
            subItems={subItems}
          />
        ))}
    </div>
  )
}

const CardQunatite = ({
  index,
  title,
  value,
  pourcentage,
  image,
  isUp,
  toggleSubItems,
  subItems
}: {
  index: number
  title: string
  value: number
  image: any
  isUp: boolean
  pourcentage?: number
  toggleSubItems: (index: number) => void
  subItems: any
}) => {
  return (
    <div className='relative transition-all ease-in-out'>
      <div
        className='flex flex-col gap-2 items-center cursor-pointer  justify-start'
        style={{
          maxWidth: '300px',
          height: '250px'
        }}
        onClick={() => toggleSubItems(index)}
      >
        <div style={{ cursor: 'pointer' }} className='flex flex-col justify-center h-full w-full'>
          <Image src={image} alt='img indicatrur' height={90} width={90} />
          <Typography variant='body1'>{title}</Typography>
        </div>
        <Typography variant='h5' color={'primary'}>
          {value}
        </Typography>

        <div className={'flex items-center justify-center w-full'}>
          <Typography variant='h5'>{pourcentage ? pourcentage?.toFixed(2) : 0.0}%</Typography>
          <IconifyIcon
            icon={isUp ? 'mdi:menu-up' : 'mdi:menu-down'}
            color={isUp ? 'green' : 'red'}
            fontSize={'4rem'}
            fontWeight={'2rem'}
          />
        </div>
      </div>
      <div>
        {subItems.index === index && subItems.show && (
          <div
            className={`absolute cursor-pointer ease-in-out top-full ${
              index % 2 !== 0 ? 'right-0' : 'left-0'
            } sm:left-0 w-80 bg-white shadow-lg border border-gray-200 mt-2 z-10 `}
            onClick={() => toggleSubItems(index)}
          >
            {subItems.data.map((subItem: any, idx: number) => (
              <div key={idx} className='border-b-2 border-gray-300 p-2'>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: '#F6F7F0'
                  }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URP}/${subItem.icon}`}
                    alt='subitem icon'
                    height={50}
                    width={40}
                  />
                  <Typography color={'primary'}> {formatNumber(subItem.value)}</Typography>
                  <div className={subItem.changePercentage === 0 ? 'hidden' : 'flex'}>
                    <Typography color={subItem.isUp ? 'green' : 'red'}>
                      {subItem.changePercentage ? subItem.changePercentage.toFixed(2) : 0.0} %
                    </Typography>
                    <IconifyIcon
                      icon={subItem.isUp ? 'mdi:menu-up' : 'mdi:menu-down'}
                      color={subItem.isUp ? 'green' : 'red'}
                      fontSize={'2rem'}
                      fontWeight={'2rem'}
                    />
                  </div>
                </Box>
                <Typography
                  sx={{
                    backgroundColor: '#F6F7F0'
                  }}
                >
                  {subItem.title}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QualiteRealTime
