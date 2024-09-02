'use client'

import { Link, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { fetchOnePost } from 'src/api/posts/posts'

import { fetchPosts } from 'src/api/posts/posts'

export default function DocsItemPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { id } = router.query

  const {
    data: item,
    isLoading,
    error: isNewsError
  } = useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchOnePost(id),
    enabled: !!id
  })
  // const { data: docs } = useQuery({
  //   queryKey: ['docs'],
  //   queryFn: () =>
  //     fetchPosts({
  //       isPosts: false,
  //       isPublic: true
  //     })
  // })

  const { data: docs } = useQuery({
    queryKey: ['docs'],
    queryFn: () =>
      fetchPosts({
        option: 'docs',
        main: true,
        pageSize: 5
      })
  })
  // const { data: news } = useQuery({
  //   queryKey: ['news'],
  //   queryFn: () =>
  //     fetchPosts({
  //       isPosts: false,
  //       isPublic: true
  //     })
  // })
  const { data: news } = useQuery({
    queryKey: ['news'],
    queryFn: () =>
      fetchPosts({
        option: 'news',
        main: true,
        pageSize: 5
      })
  })

  if (isLoading || isNewsError) return <FallbackSpinner />
  if (!item) return null

  return (
    <>
      <div id='__next' className='pt-20 h-full snap-start font-fira-sans text-base text-gray-700 min-h-[500px]'>
        <>
          <div className='grid grid-cols-2 grid-rows-1 gap-4'>
            <div>
              <Typography className=' font-medium text-green-600 pb-4 mb-6 border-b border-green-600' variant='h4'>
                {item.title}
              </Typography>
              <div>
                <p className='mt-6 mb-6'>
                  <a
                    className='inline-block bg-green-600 text-white rounded-full px-6 py-2'
                    target='_blank'
                    href={process.env.NEXT_PUBLIC_API_URP + '/' + item.url}
                  >
                    <i className='fas fa-file-pdf mr-2'></i> {t('Télécharger')} | 1.66MB{' '}
                  </a>
                </p>
              </div>
              <img src={process.env.NEXT_PUBLIC_API_URP + '/' + item.url} alt='' className='object-cover mt-6 mb-6' />
              <p className='leading-8 text-justify' dangerouslySetInnerHTML={{ __html: item.content }}></p>
            </div>
            <div>
              <div className='mb-4  bg-green-600 shadow-sm rounded-lg  p-5'>
                <h3 className=' text-xl font-medium text-white pb-4 border-b border-gray-300'>{t('Actualités')}</h3>
                <ul className=''>
                  {news?.data.map(item => (
                    <li key={item.id} className=' text-white py-3 px-5 border-b border-gray-200'>
                      <a href={`/news/${item.id}`} className='block'>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              {docs?.data.filter(docsItem => docsItem.id !== item.id).length > 0 && (
                <div className='mt-6 bg-white shadow-sm rounded-none p-5'>
                  <h3 className=' text-xl font-medium text-green-600 uppercase pb-4 border-b border-green-600'>
                    {t('Autres titres')}
                  </h3>
                  <ul className='list-group'>
                    {docs?.data
                      .filter(docsItem => docsItem.id !== item.id)
                      .map(docsItem => (
                        <li key={docsItem.id} className=' text-green-600 py-3 px-5 border-b border-gray-200'>
                          <a href={`/docs/${docsItem.id}`} className='block'>
                            {t(docsItem.title)}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      </div>
    </>
  )
}

DocsItemPage.guestGuard = true // This page isn't restricted to guests only
DocsItemPage.authGuard = false // This page isn't restricted to authorized users only
DocsItemPage.acl = false
DocsItemPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
