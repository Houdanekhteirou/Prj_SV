'use client'

import { Typography } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import QuantiteStatistiques from 'src/@core/components/statistiques/Quantite'
import { useRouter } from 'next/router'
import QualiteStatistiques from 'src/@core/components/statistiques/Qualite'
import AppSelect from 'src/@core/components/statistiques'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Head from 'next/head'
import FilePreview from 'src/@core/components/file-previw/Preview'

const Home = () => {
  const { t } = useTranslation()
  const [screenWidth, setScreenWidth] = useState<number>(0)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth)
    })
    setScreenWidth(window.innerWidth)
  }, [])

  const [activeTab, setActiveTab] = useState('quantite')

  // the active tab on the url look for page query
  const router = useRouter()

  useEffect(() => {
    if (router.query?.page) {
      setActiveTab(router.query.page as string)
    }
  }, [router.query])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push({ query: { page: tab } })
  }

  const tabs = [
    {
      title: t('QUANTITÉ'),
      value: 'quantite'
    },
    {
      title: t('QUALITÉ'),
      value: 'qualite'
    },
    {
      title: t('PAIMENTS'),
      value: 'paiements'
    },
    {
      title: t('RECHERCHE'),
      value: 'recherche'
    },
    {
      title: t('OUTILS'),
      value: 'outils'
    }
  ]

  const renderTabs = () => {
    return (
      <div className='flex flex-row gap-2 sm:gap-12 overflow-x-auto'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer text-center py-2  ${activeTab === tab.value ? 'border-b-4 border-red-600' : ''}`}
            onClick={() => handleTabChange(tab.value)}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {tab.title}
            </Typography>
          </div>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'quantite':
        return <QuantiteStatistiques />
      case 'qualite':
        return <QualiteStatistiques />

      case 'paiements':
        return (
          <div className='flex flex-col gap-4 justify-center items-center h-48'>
            <Typography variant='h5'>{t('PAIMENTS')}</Typography>
            <Typography>{t('En_cours_construction')}</Typography>
          </div>
        )
      case 'recherche':
        return (
          <div className='flex flex-col gap-4 justify-center items-center h-48'>
            <Typography variant='h5'>{t('RECHERCHE')}</Typography>
            <Typography>{t('En_cours_construction')}</Typography>
          </div>
        )
      case 'outils':
        return (
          <div className='flex flex-col gap-4 justify-center items-center h-48'>
            <Typography variant='h5'>{t('OUTILS')}</Typography>
            <Typography>{t('En_cours_construction')}</Typography>
          </div>
        )
      default:
        return <QuantiteStatistiques />
    }
  }

  return (
    <div>
      <Head>
        <title>Statistiques | Projet Inaya Elargi</title>
        <meta
          name='description'
          content='Explorez les visualisations de données du Projet Inaya Elargi, comprenant les séries de données validées, les indicateurs, les localisations, et les périodes. Accédez aux données quantitatives, qualitatives et de paiement pour toutes les zones couvertes.'
        />
        <meta
          name='keywords'
          content='Statistiques, Visualisations de données, Projet Inaya Elargi, Santé, Mauritanie, Financement basé sur la performance, Données validées, Indicateurs, Localisations, Périodes, Quantité, Qualité, Paiements, Recherche, Outils'
        />
        <meta name='author' content='Projet Inaya Elargi' />
        <meta property='og:title' content='Statistiques | Projet Inaya Elargi' />
        <meta
          property='og:description'
          content='Explorez les visualisations de données du Projet Inaya Elargi, comprenant les séries de données validées, les indicateurs, les localisations, et les périodes. Accédez aux données quantitatives, qualitatives et de paiement pour toutes les zones couvertes.'
        />
        <meta property='og:image' content='/images/og-image-stats.jpg' />
        <meta property='og:url' content='https://portailpbf.gov.mr/stats' />
        <link rel='canonical' href='https://www.portailpbf.gov.mr.com/stats' />
        <meta property='og:type' content='website' />
        <meta property='og:locale' content='fr_FR' />
        <meta property='og:locale' content='ar_MA' />
      </Head>
      <div className='border-t-4 border-t-red-600 p-2 sm:p-6 justify-start flex flex-col'>
        <Typography
          sx={{
            color: 'black',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
          color={'black'}
        >
          {t('VISUALISATIONS DE DONNÉES')}{' '}
        </Typography>{' '}
        <hr className='w-72 h-1.5 my-1 bg-red-600' />
        <Typography
          sx={{
            color: 'black',
            fontSize: '1.2rem'
          }}
        >
          {t(
            'Présentation de toutes les séries de type bases de données (Open Data) produites par les rapports issus des différentes evaluations du Projet. il est question ici des données validées, plusieurs types de présentation sont disponibles à differentes périodes du projet et dans toutes les zones couvertes.'
          )}{' '}
        </Typography>{' '}
      </div>
      <div
        className='flex flex-col lg:flex-row justify-start gap-10 px-6 lg:px-20'
        style={{
          backgroundColor: '#01A753'
        }}
      >
        {renderTabs()}{' '}
      </div>
      <DatePickerWrapper> {renderContent()} </DatePickerWrapper>{' '}
    </div>
  )
}

Home.guestGuard = true
Home.authGuard = false
Home.acl = false
Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
