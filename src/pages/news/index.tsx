'use client'

import { Container } from 'src/@core/components/container'

import { ReactNode } from 'react'

import { Link, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { fetchPosts } from 'src/api/posts/posts'

const Home = () => {
  const { t } = useTranslation()

  // const {
  //   data: news,
  //   isLoading,
  //   error: isNewsError
  // } = useQuery({
  //   queryKey: ['news'],
  //   queryFn: () => fetchPosts({})
  // })

  const {
    data: news,
    isLoading,
    error: isNewsError
  } = useQuery({
    queryKey: ['news'],
    queryFn: () =>
      fetchPosts({
        option: 'news',
        main: true,
        pageSize: 5
      })
  })

  return (
    <>
      <Container className='pt-8 h-full mb-8  snap-start'>
        <div className='flex flex-col gap-8'>
          <div className='mb-20 mt-20'>
            <Typography className='text-center' variant='h4'>
              {t('news')}
            </Typography>{' '}
          </div>{' '}
          {isLoading ? (
            <p>
              <FallbackSpinner />
            </p>
          ) : (
            news?.data?.map((item, index) => (
              <div key={index} className='sm:flex justify-between items-center'>
                <div className='flex flex-col gap-1.5 max-w-lg flex-shrink-0 mb-12 xl:mb-O'>
                  <div>
                    <Typography variant='h6'>{t(item.title)}</Typography>
                    <Typography
                      variant='caption'
                      dangerouslySetInnerHTML={{ __html: item?.content?.slice(0, 100) + '...' }}
                    ></Typography>
                  </div>
                  <Link href={`/news/${item.id}`}>{t('read_more')}</Link>
                </div>
                <img
                  src={process.env.NEXT_PUBLIC_API_URP + '/' + item.url}
                  alt=''
                  width={300}
                  height={300}
                  className=' object-cover'
                />
              </div>
            ))
          )}
        </div>
      </Container>
    </>
  )
}

Home.guestGuard = true // This page isn't restricted to guests only
Home.authGuard = false // This page isn't restricted to authorized users only
Home.acl = false
Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
