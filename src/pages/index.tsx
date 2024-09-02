'use client'

import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import QualiteRealTime from 'src/@core/components/RealTimeIndicators'
import TopQualite from 'src/@core/components/topqualit'
import VideoCard from 'src/@core/components/videoCard'
import Login from 'src/pages/login'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { get_zone } from 'src/api/select_filters'

const Home = () => {
  const { t } = useTranslation()

  const { data: allWilaya, isLoading: isLoadingWilayaa } = useQuery({
    queryKey: ['wilaya_map'],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 2
      })

      return res
    }
  })

  const Map = React.useMemo(() => dynamic(() => import('src/@core/components/map/MapComponent'), { ssr: false }), [])

  return (
    <div className=''>
      <Head>
        <title>Suit Ev</title>
        <meta
          name='description'
          content='Bienvenue sur le site du Projet Inaya Elargi, un programme de financement basé sur la performance dans le secteur de la santé en Mauritanie.'
        />
        <meta name='google-site-verification' content='xfsMyQ_To0AM33dwpAI_l2tijzetdGSyYIHRj4NY-Ho' />
        <meta name='keywords' content='Projet Inaya Elargi, Santé, Mauritanie, Financement basé sur la performance' />
        <meta property='og:title' content='Accueil | Projet Inaya Elargi' />
        <meta
          property='og:description'
          content='Bienvenue sur le site du Projet Inaya Elargi, un programme de financement basé sur la performance dans le secteur de la santé en Mauritanie.'
        />
        <meta name='author' content='Projet Inaya Elargi' />
        <meta property='og:image' content='/images/rim.svg' />
        <meta property='og:url' content='https://www.portailpbf.gov.mr.com/' />
        <link rel='canonical' href='https://www.portailpbf.gov.mr.com/' />

        <meta property='og:type' content='website' />
        <meta property='og:locale' content='fr_FR' />
        <meta property='og:locale' content='ar_MA' />
      </Head>

      {/* go to /login */}

      <Login />
      {/*
      <section className='w-full  '>
        <Map allWilaya={allWilaya} />{' '}
      </section>

      <div className='my-4'>
        <Typography variant='h4'>{t('realtime_results')}</Typography>
      </div>

      <section
        id='real-time-indicators'
        className='w-full'
        style={{
          backgroundColor: '#F6F7F0'
        }}
      >
        <QualiteRealTime allWilaya={allWilaya} />
      </section>
      <section id='top-qualite bg-white' className='w-full py-10'>
        <TopQualite allWilaya={allWilaya} />
      </section>
      <section id='video' className='w-full pb-10'>
        <header className='flex justify-between items-center pb-4'>
          <Typography variant='h5' color={'#B0233A'}>
            {t('VIDEOS')}
          </Typography>
        </header>
        <VideoCard />
      </section>
     */}
    </div>
  )
}

Home.guestGuard = true // This page isn't restricted to guests only
Home.authGuard = false // This page isn't restricted to authorized users only
Home.acl = false
Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
