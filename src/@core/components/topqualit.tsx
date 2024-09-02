import { Button, FormControl, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import { fetchTopQualiIndicators } from 'src/api/other'
import IconifyIcon from './icon'
import { years } from '../utils'
import Link from 'next/link'
import { get_zone } from 'src/api/select_filters'

const TopQualite = ({ allWilaya }) => {
  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const { t, i18n } = useTranslation()
  const [trimester, setTrimester] = useState(1)
  const [year, setYear] = useState(2024)

  const { data: allMoughataa, isLoading: isLoadingMoughataa } = useQuery({
    queryKey: ['moughataa_top_qualite', wilaya],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 4,
        parentId: wilaya
      })

      return res
    },
    enabled: !!wilaya
  })

  const { data: allZoneSanitaire, isLoading: isLoadingZoneSanitaire } = useQuery({
    queryKey: ['zoneSanitaire_top_qualite', moughataa],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 5,
        parentId: moughataa
      })

      return res
    },
    enabled: !!moughataa
  })

  const [selectedPaqet, setSelectedPaqet] = useState('')
  const [zoneId, setZoneId] = useState('')

  const { data: topQualiteDumy, isLoading: isTopQualiteLoading } = useQuery({
    queryKey: ['top_qualite', zoneId, trimester, year],
    queryFn: () =>
      fetchTopQualiIndicators({
        quarter: trimester,
        year: year,
        zoneId
      })
  })
  useEffect(() => {
    if (isTopQualiteLoading) return
    setSelectedPaqet(topQualiteDumy?.data[0].id)
  }, [topQualiteDumy, isTopQualiteLoading])

  const selctedPauetData = useMemo(() => {
    if (!selectedPaqet) return null
    if (isTopQualiteLoading) return null

    return topQualiteDumy?.data.find(el => el.id === selectedPaqet)
  }, [selectedPaqet, topQualiteDumy])

  return (
    <div className='flex flex-col w-full gap-4'>
      <header className='flex justify-between items-center'>
        <Typography variant='h5' color={'primary'} className='text-left'>
          {t('TOP QUALITE')}
          <span className='text-gray-500 text-sm'>({t('Indicateurs qualitatifs')})</span>
        </Typography>
      </header>
      <div className='flex flex-wrap w-full  pt-2  gap-6 '>
        <div className='flex flex-col h-full flex-grow gap-10 '>
          <FormControl fullWidth>
            <Select
              fullWidth
              variant='standard'
              onChange={(e: any) => {
                setSelectedPaqet(e.target.value)
              }}
              sx={{
                height: '3rem'
              }}
              size='medium'
              value={selectedPaqet}
            >
              {topQualiteDumy?.data.map((el, index) => (
                <MenuItem key={index} value={el.id}>
                  {el.uid}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className='flex flex-wrap '>
            <FormControl sx={{ flexGrow: 1 }}>
              <Select
                variant='standard'
                value={year}
                onChange={e => {
                  setYear(e.target.value)
                }}
              >
                {years.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <Select
                name='trimester'
                value={trimester}
                onChange={e => {
                  setTrimester(e.target.value)
                }}
                variant='standard'
              >
                {Array.from({ length: 4 }, (_, i) => i + 1).map((trimester, index) => (
                  <MenuItem key={index} value={trimester}>
                    {t('T') + trimester}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='flex   flex-grow'>
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
                <MenuItem value={null}>{t('None')}</MenuItem>
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
                <MenuItem value={null}>{t('None')}</MenuItem>
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
                    {zoneSanitaire.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {isTopQualiteLoading ? (
          <div className='flex gap-2 items-center flex-grow'>
            <div className='flex-col items-center'>
              <Skeleton variant='rectangular' width={200} height={200} />
            </div>
            <div className='flex flex-col  w-full'>
              <Skeleton variant='text' width={200} height={40} />
              <div className='flex gap-4'>
                <Skeleton variant='text' width={100} height={40} />
              </div>
              <div className='w-full gap-4'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <div className='flex border-b-2 pb-3 items-center' key={index}>
                    <div className='flex justify-between items-center h-full w-full'>
                      <Skeleton variant='text' width={100} height={40} />
                      <Skeleton variant='text' width={100} height={40} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex gap-2 items-center flex-grow'>
            <div className='flex-col items-center'>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URP}/${selctedPauetData?.data[0].icon}`}
                className='h-40 fill-green-700 '
                alt=''
              />
            </div>
            <div className='flex flex-col  w-full'>
              <Typography variant='h5'>{selctedPauetData?.data[0].name}</Typography>
              <div className='flex gap-4'>
                <Typography variant='h6' color={'primary'}>
                  {selctedPauetData?.data[0].global}%
                </Typography>
              </div>
              <div className='w-full gap-4'>
                {selctedPauetData?.data.slice(1).map((el, index) => (
                  <div className='flex border-b-2 pb-3 items-center' key={index}>
                    <div className='flex justify-between items-center h-full w-full'>
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: 400
                        }}
                      >
                        {el.name}
                      </Typography>

                      <div className='flex  items-center justify-center'>
                        <Typography variant='h6'>{el.global}%</Typography>
                        <IconifyIcon icon={el.up ? 'mdi:menu-up' : 'mdi:menu-down'} color={el.up ? 'green' : 'red'} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='self-center '>
        <Link href='/stats/?page=qualite' passHref>
          <Button variant='outlined' color='primary'>
            {t('Voir plus')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default TopQualite
