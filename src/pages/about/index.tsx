'use client'
import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { Card1, Card2, Card3, CardOrganisation } from 'src/@core/components/about-page/cards'
import { fetchWidgets } from 'src/api/app-widgets'
import { fetchPosts } from 'src/api/posts/posts'
import { posts_options } from 'src/configs/constant'
import FallbackSpinner from 'src/@core/components/spinner'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { getPath } from 'src/constants'

function Page() {
  const { t, i18n } = useTranslation()

  const locale = i18n.language

  const {
    data: temoignages,
    isLoading: isNewsLoading,
    error: isNewsError
  } = useQuery({
    queryKey: ['temoignages'],
    queryFn: () =>
      fetchPosts({
        option: posts_options[2].value
      })
  })

  const {
    data: organisation,
    isLoading: isNewsLoading2,
    error: isNewsError2
  } = useQuery({
    queryKey: ['organisation'],
    queryFn: () =>
      fetchPosts({
        option: posts_options[3].value
      })
  })

  const {
    data: main,
    isLoading: isLoadingMain,
    isError: isMainError
  } = useQuery({
    queryKey: ['widgets'],
    queryFn: async () => {
      const res = await fetchWidgets({ uid: 'about', name: 'main' })

      if (locale === 'ar') return JSON.parse(res.translations_origine)[0]['value']

      return JSON.parse(res.options)
    }
  })

  if (isNewsLoading || isNewsLoading2 || isLoadingMain)
    return (
      <div>
        <FallbackSpinner />
      </div>
    )
  if (isNewsError || isNewsError2 || isMainError)
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <h1>Une erreur s'est produite</h1>
      </div>
    )

  const downloadVolumes = () => {
    // start downloading the file
    const link1 = document.createElement('a')
    link1.href = '/Manuel PBF Volume 1 ANO 2024 V_17_2_2024.pdf'
    link1.setAttribute('download', 'Manuel PBF Volume 1 ANO 2024 V_17_2_2024.pdf')
    document.body.appendChild(link1)
    link1.click()
    document.body.removeChild(link1)

    const link2 = document.createElement('a')
    link2.href = '/Manuel PBF Volume 2 ANO 2024 V_17_2_2024.pdf'
    link2.setAttribute('download', 'Manuel PBF Volume 2 ANO 2024 V_17_2_2024.pdf')
    document.body.appendChild(link2)
    link2.click()
    document.body.removeChild(link2)
  }

  return (
    <main className=''>
      <Head>
        <title>À Propos | Projet Inaya Elargi</title>
        <meta
          name='description'
          content='Découvrez le Projet Inaya Elargi, une initiative de financement basé sur la performance dans le secteur de la santé en Mauritanie. Apprenez-en plus sur nos objectifs, notre contexte et notre impact.'
        />
        <meta
          name='keywords'
          content='Projet Inaya Elargi, Santé, Mauritanie, Financement basé sur la performance, PNS 2029, Gouvernance sanitaire, Réforme système de santé, PBF'
        />
        <meta name='author' content='Projet Inaya Elargi' />
        <meta property='og:title' content='À Propos | Projet Inaya Elargi' />
        <meta
          property='og:description'
          content='Découvrez le Projet Inaya Elargi, une initiative de financement basé sur la performance dans le secteur de la santé en Mauritanie. Apprenez-en plus sur nos objectifs, notre contexte et notre impact.'
        />
        <meta property='og:url' content='https://www.portailpbf.gov.mr/about' />
        <link rel='canonical' href='https://www.portailpbf.gov.mr.com/about' />

        <meta property='og:type' content='website' />
        <meta property='og:locale' content='fr_FR' />
        <meta property='og:locale:alternate' content='ar_MA' />
      </Head>
      <div className='relative'>
        <div style={{ height: '500px' }}>
          <Image
            className='w-screen object-cover'
            src={`${process.env.NEXT_PUBLIC_API_URP}/${main?.imagePath}`}
            alt='Random image'
            sizes='100vw'
            fill
          />
        </div>
        {/* <div className='absolute inset-0 opacity-60 rounded-md'></div> */}
        <div className='absolute inset-0 flex items-end justify-center'>
          <div
            className='bg-white inset-0 opacity-60 sm:p-10 p-2'
            style={{
              width: '1000px'
              // height: '200px'
            }}
          >
            <h2 className='text-black sm:text-4xl font-bold'>{main.title}</h2>
            <div className='bg-red-500 h-1 w-40 mt-2'></div>
          </div>
        </div>
      </div>
      {/* Render sections dynamically */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-3  mt-10 justify-center'>
        {' '}
        <div className='px-4 md:px-10 gap-4 flex flex-col  col-span-2'>
          <div>
            <Typography variant='h6' className='text-justify line-h' color={'black'}>
              {t(main.description)}
            </Typography>
          </div>
          {main.sections.map((section, index) => (
            <div key={index}>
              <Typography variant='h4' color={'red'} className='text-justify mt-4 md:mt-10  '>
                {t(section.title)}
              </Typography>
              <Typography style={{ fontSize: '1rem' }} className='text-justify mt-4 md:mt-10'>
                {t(section.description)}
              </Typography>
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-4 md:pl-4'>
          {main.cards.map((card, index) => (
            <Card1 key={index} titles={card.title} descriptions={card.description} image={card.image} />
          ))}
        </div>
      </div>
      <div className='w-full flex justify-center my-2'>
        <button onClick={() => downloadVolumes()} className='bg-yellow-400 text-grey w-96 px-4 py-2 mt-10'>
          {t(main.buttonText)}
        </button>
      </div>

      <div className='w-full p-6 md:p-10 bg-gray-700 bg-opacity-5'>
        <Typography variant='h4' color={'red'} className='text-start mt-6 md:mt-10'>
          {t('ORGANISATION')}
        </Typography>
        <Typography variant='h5' color={'black'} className='text-start mt-6 md:mt-10'>
          {t('MONTAGE INSTITUTIONNEL ET FONCTIONNEL DU PBF')}
        </Typography>
        <Typography variant='h6' color={'grey'} className='text-start mt-6 md:mt-10'>
          {t(
            'Le dispositif institutionnel du PBF mis en place en Mauritanie respecte le principe de séparation des différentes fonctions :'
          )}
        </Typography>

        <div className='flex justify-center items-center w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-10 items-center w-full'>
            {organisation?.data?.map((organization, index) => (
              <CardOrganisation
                title={t(organization.title)}
                key={index}
                description={t(organization?.content)}
                image={getPath(organization?.resourceId)}
              />
            ))}
          </div>
        </div>
        <div>
          <div className='grid grid-cols-2 grid-rows-2 gap-2'>
            <div className='w-full flex justify-center my-2 mt-10'>
              <Typography>{t('Les principaux organes de ce dispositif institutionnel sont les suivants :')}</Typography>
            </div>
            <div>
              <a
                href='https://www.youtube.com/watch?v=JexIYaoEvrI'
                target='_blank'
                className='w-full flex justify-center my-2'
              >
                <button className='bg-red-600 text-white w-96 px-4 py-2 mt-10'>
                  {t('VISUALISER LA VIDEO DU DISPOSITF')}
                </button>
              </a>
            </div>
            <div className='w-full flex justify-center my-2 mt-2'>
              <Typography color={'red'}>
                {' '}
                {t('Le Comité de Pilotage, Le Comité Technique PBF, L’Unité technique FBR,')}
              </Typography>
            </div>
            <div>
              <a href='/Montage PBF pour la video.pptx' target='_blank' className='w-full flex justify-center my-2'>
                <button className='bg-yellow-400 text-grey w-96 px-4 py-2 mt-2'>
                  {t('VISUALISER LE SCHEMA DU DISPOSITF')}
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* <div className='flex justify-center items-center w-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-10 items-center w-full'>
              {organization.cards.map((card, index) => (
                <CardOrganisation
                  title={t(card.title)}
                  key={index}
                  description={t(card.description)}
                  image={card.image}
                />
              ))}
            </div>
          </div> */}
      </div>

      <section id='impacts' className='mt-6 md:mt-10 ml-2 mr-2 w-full p-6 md:p-10 '>
        <Typography color={'rgb(170 5 5 / 87%)'} className='mt-6 md:mt-10' variant='h4'>
          {t(main?.impacts.title)}
        </Typography>
        <Typography variant='h6' color={'black'} className='mb-6 md:mb-10 mt-2 md:mt-1 font-bold '>
          {t(main?.impacts.subtitle)}
        </Typography>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 md:mb-2 mt-4 md:mt-4 p-6 md:p-10 justify-center'>
          {main?.impacts.cards
            ?.filter(card => card.image !== '')
            .map((card, index) => (
              <>
                <Card2
                  key={index}
                  title={t(card.title)}
                  pourcentage={card.percentage}
                  total={card.total}
                  image={card.image}
                />
              </>
            ))}
        </div>
        <div className='grid sm:grid-cols-4 grid-cols-1 gap-4 ml-4 md:ml-8 mr-4 md:mr-8'>
          {main?.impacts.cards
            ?.filter(card => card.image === '')
            .map((card, index) => (
              <>
                <Card3 key={index} title={t(card.title)} pourcentage={card.percentage} number={card.number} />
              </>
            ))}
          <div className='flex h-full items-center pt-4 sm:col-span-1 col-span-full '>
            <Link href='/stats' passHref>
              <button className=' bg-yellow-400 text-black p-3'>{t('STATISTIQUES LES PLUS RÉCENTES')}</button>
            </Link>
          </div>
        </div>
      </section>

      <div className='timeline'>
        {temoignages?.data?.map((temoignage, index) => (
          <>
            <div key={index} className='timeline__component'>
              <div className='flex flex-col gap-4 w-full'>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    alignSelf: index % 2 == 0 ? 'flex-end' : 'flex-start'
                  }}
                  color={'green'}
                >
                  {t(temoignage.title)}
                </Typography>
                {temoignage.resourceId && (
                  <Image width={700} height={500} src={getPath(temoignage.resourceId)} alt='img2' />
                )}{' '}
                <p className='text-justify' dangerouslySetInnerHTML={{ __html: temoignage?.content }}></p>
                <div
                  className='flex gap-4 text-justify flex-grow mt-4'
                  style={{
                    alignSelf: 'flex-end'
                  }}
                >
                  <div className='bg-gray-800 h-1 w-40 mt-4'></div>
                  <div className='flex text-center flex-col'>
                    <Typography
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                      color={'black'}
                      className='text-start  mt-10'
                    >
                      {t(temoignage.author)}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'grey'
                      }}
                      className='text-start  '
                    >
                      {t(temoignage.authorFunction)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            {index % 2 === 0 && (
              <div className='timeline__middle'>
                <div className='timeline__point__box'>
                  <div className='timeline__point'></div>
                  <div className='timeline__point__lign__left'></div>

                  {index % 2 === 0 && temoignages?.data.length - 1 !== index && (
                    <div className='timeline__point__lign__right'></div>
                  )}
                </div>
              </div>
            )}
          </>
        ))}
        {/* <div className='flex h-full items-center pt-4 sm:col-span-1 col-span-full '>
            <button className='bg-yellow-400 text-black p-3'>{t(main.buttonText)}</button>
          </div> */}
      </div>

      <div className='w-full flex  my-2 justify-end '>
        <button className='bg-green-600 text-white w-96 px-4 py-2 mb-4 '>{t('CONSULTER PLUS DE TÉMOIGNAGES')}</button>
      </div>
    </main>
  )
}

Page.guestGuard = true // This Page isn't restricted to guests only
Page.authGuard = false // This Page isn't restricted to authorized users only
Page.acl = false
Page.getLayout = (Page: ReactNode) => <BlankLayout>{Page}</BlankLayout>

export default Page
