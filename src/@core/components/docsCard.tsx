import { Button, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icon } from '@iconify/react'
import { Box } from '@mui/material'
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState } from 'react'

export default function DocsCard({ data }) {
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
                <div className='flex flex-col gap-8 max-w-lg  mb-12 xl:mb-O p-10 ' key={index}>
                  <Icon icon='arcticons:google-docs' fontSize={120} className=' self-center w-full  ' />
                  <Typography variant='h6'>{title}</Typography>

                  <div>
                    <Button variant='contained'>
                      <a href={process.env.NEXT_PUBLIC_API_URP + '/' + url}>{t('download')}</a>
                    </Button>
                    <Link href={`/docs/${id}`}>{t('savoir plus')}</Link>
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
          onClick={(e: any) => e.stopPropagation() || (instanceRef?.current !== null && instanceRef?.current?.next())}
        />
      </Box>
    </>
  )
}
