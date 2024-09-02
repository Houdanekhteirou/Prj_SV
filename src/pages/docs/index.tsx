'use client'

import { Container } from 'src/@core/components/container'

// import RealTimeIndicators from '@/components/RealTimeIndicators'
// import TopQualiteIndicators from '@/components/TopQualiteIndicators'
import { ReactNode } from 'react'

// import Footer from '@/components/Footer'
// import DocumentationSection from '@/components/DocumentationSection'
// import NewsCard from '@/components/NewsCard'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { fetchPosts } from 'src/api/posts/posts'
import { Button, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import Head from 'next/head'

const Home = () => {
  const { t } = useTranslation()
  const {
    data: docs,
    isLoading,
    error: isDocsError
  } = useQuery({
    queryKey: ['docs'],
    queryFn: () =>
      fetchPosts({
        option: 'docs',
        all: true
      })
  })

  return (
    <>
      <Container className=' h-screen'>
        <Head>
          <link rel='canonical' href='https://www.portailpbf.gov.mr.com/docs' />
        </Head>
        <div className='mb-20 mt-20'>
          <Typography className='text-center' variant='h4'>
            {t('Documentations')}{' '}
          </Typography>{' '}
        </div>
        {isLoading ? (
          <p>
            <FallbackSpinner />
          </p>
        ) : (
          <div className='w-full flex flex-wrap gap-5'>
            {docs?.data.map((item, index) => (
              <div className='flex flex-col gap-3.5  border-2 justify-center items-center p-4' key={index}>
                <IconifyIcon icon='bi:file-earmark-text' className='text-4xl ' />
                <div>
                  <Typography variant='h6'>{item.title}</Typography>
                </div>
                <div>
                  <Button variant='contained'>
                    <a href={`${process.env.NEXT_PUBLIC_API_URP}/${item.url}`} target='_blank'>
                      {t('download')}
                    </a>
                  </Button>
                  <Button>{t('savoir plus')}</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

Home.guestGuard = true // This page isn't restricted to guests only
Home.authGuard = false // This page isn't restricted to authorized users only
Home.acl = false
Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
