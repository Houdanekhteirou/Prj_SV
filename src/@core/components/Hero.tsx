'use client'
import React from 'react'
import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import VideoPlayer from './VideoPlayer'

function Hero() {
  const { t } = useTranslation()

  const goToAbout = () => {
    window.location.href = '/about'
  }

  return (
    <main id='home' className='flex flex-col gap-20 pt-8 pb-2'>
      <div className='sm:flex justify-between items-center'>
        <div className='flex flex-col gap-3.5 max-w-lg flex-shrink-0 mb-12 xl:mb-O'>
          <div>
            <Typography variant='h4'>{t('hero_t')}</Typography>
            <Typography variant='subtitle2'>{t('hero_p')}</Typography>
          </div>
          <Button rounded='md' href='/about' className='self-start uppercase mt-2' color='primary'>
            {t('savoir plus')}
          </Button>
        </div>

        {/* <Carousel images={["illustrations/pbf1.svg"]} /> */}
        {/* <Image src={'images/pbf1.svg'} alt=''  className=' object-cover' /> */}
        <VideoPlayer url='https://www.youtube.com/embed/JexIYaoEvrI' width={500} height={500} />
      </div>
    </main>
  )
}

export default Hero
