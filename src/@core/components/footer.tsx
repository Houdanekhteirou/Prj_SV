'use client'
import { Link, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchPosts } from 'src/api/posts/posts'
import { Logo } from './Logo'
import Image from 'next/image'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const {
    data,
    isLoading: isNewsLoading,
    error: isNewsError
  } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const data = await fetchPosts({
        main: true,
        all: true
      })

      return {
        news: data.data.filter(item => item.options === 'news') || [],
        docs: data.data.filter(item => item.options === 'docs') || []
      }
    }
  })
  if (isNewsLoading) return <></>

  return (
    <footer>
      <section id='footer' className=' border-t-4 border-emerald-500 w-full pt-2 flex justify-around  flex-wrap '>
        <div className={`flex flex-col  justify-between ${locale === 'ar' ? 'border-l-2' : 'border-r-2'}`}>
          <Logo />
          <Typography variant='h4'>{t('INAYA | ÉLARGI ')}</Typography>
          <Typography variant='caption'>{t('FINANCEMENT BAS SUR LA PERFORMANCE')}</Typography>
          <Typography variant='body1'>{t('TVZ V N° 245,Nouakchott, Mauritanie')}</Typography>
          <Typography variant='body1'>{t('+222 45 25 25 25')}</Typography>
          <Typography variant='body1'> projet.inaya@gmail.com </Typography>
        </div>
        <div className='flex flex-col gap-5 max-w-sm'>
          <div className='flex gap-4 items-center '>
            <Image src='/icons/HealthPBF-C-icons_news.svg' alt='icon' height={40} width={40} />
            <Typography variant='h4' color={'primary'}>
              <Link href='/news'> {t('Actualités')}</Link>
            </Typography>
          </div>
          <div className='flex gap-4 items-start flex-col '>
            {data?.news?.map(item => (
              <div className='py-4 border-b-2 ' key={item.id}>
                <Link href={`/news/${item.id}`} color='inherit' underline='hover'>
                  <Typography variant='body1'>{item.title}</Typography>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-5 max-w-sm '>
          <div className='flex gap-4 items-center '>
            <Image src='/icons/HealthPBF-C-icons_archives.svg' alt='icon' height={40} width={40} />
            <Typography variant='h4' color={'primary'}>
              <Link href='/docs'>{t('Publications')}</Link>
            </Typography>
          </div>
          <div className='flex gap-4 items-start flex-col '>
            {data?.docs?.map(item => (
              <div className='py-4 border-b-2 ' key={item.id}>
                <Link href={`/docs/${item.id}`} color='inherit' underline='hover'>
                  <Typography variant='body1'>{item.title}</Typography>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='w-full    border-t-4 border-t-red-600 py-6 md:py-10 px-12 md:px-20 bg-primary-600 mt-10'>
        <div className='md:flex md:gap-8 items-center justify-center'>
          <div className='mt-6 md:mt-0'>
            <h6 className='text-yellow-400 font-bold text-base'>{t('linked_links')}</h6>
            <div className='flex flex-col items-start  sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2'>
              <a className='text-sm text-white hover:text-yellow-400 ' href='/partners'>
                {t('partners')}
              </a>
              <a className='text-sm text-white hover:text-yellow-400 ' href='https://www.sante.gov.mr' target='_blank'>
                {t('sante_ministry')}
              </a>
              <a className='text-sm text-white hover:text-yellow-400 ' href='https://www.camec.mr' target='_blank'>
                {t('camec')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
