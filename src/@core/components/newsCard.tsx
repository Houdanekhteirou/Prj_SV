import { Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icon } from '@iconify/react'
import { Box } from '@mui/material'
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState } from 'react'

// ** Third Party Components
export default function NewsCard({ data }) {
  const { t } = useTranslation()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    // responsive
    slides: {
      perView: 1,
      spacing: 6,
      origin: 'auto'
    },
    breakpoints: {
      '(min-width: 400px)': {
        slides: { perView: 2, spacing: 5 }
      },
      '(min-width: 1000px)': {
        slides: { perView: 3, spacing: 10 }
      }
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update()
    }
  }, [data])

  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  return (
    <>
      <Box className='navigation-wrapper'>
        <Box ref={sliderRef} className='keen-slider'>
          {data?.map((item, index) => {
            const { title, content, url, date, id } = item

            return (
              <Box className='keen-slider__slide shadow-md p-4 ' key={index}>
                <div className='flex flex-col gap-1.5 max-w-lg flex-shrink-0  xl:mb-O mt-4'>
                  <article className='relative  hover:scale-110 transition-all duration-500 ease-in-out isolate flex flex-col justify-end overflow-hidden rounded-xl px-8 pb-8 pt-40 max-w-sm mx-auto'>
                    <img
                      src={process.env.NEXT_PUBLIC_API_URP + '/' + url}
                      alt='University of Southern California'
                      className='absolute inset-0 h-full w-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40'></div>
                    <Typography
                      variant='h6'
                      sx={{
                        zIndex: 10,
                        color: 'white'
                      }}
                      color={'white'}
                    >
                      {t(title)}
                    </Typography>
                  </article>
                  <div className='p-8 '>
                    <Typography
                      variant='body1'
                      dangerouslySetInnerHTML={{
                        __html: content?.slice(0, 200) + '...'
                      }}
                    ></Typography>
                    <Link href={`/news/${id}`} className='always'>
                      {t('read_more')}
                    </Link>
                  </div>
                </div>
              </Box>
            )
          })}
        </Box>
        <Icon
          icon='mdi:chevron-left'
          className={clsx('arrow arrow-left')}
          color='green'
          onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
        />

        <Icon
          icon='mdi:chevron-right'
          className={clsx('arrow arrow-right')}
          color='green'
          onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
        />
      </Box>
    </>
  )
}
