import { Card, CardContent, CardMedia, Grid, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { fetchPosts } from 'src/api/posts/posts'

import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'

export default function NewsCard({ data }) {
  const { t } = useTranslation()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
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
      setCurrentSlide(slider.details().relativeSlide)
    },
    created() {
      setLoaded(true)
    }
  })
  const { data: docs } = useQuery({
    queryKey: ['docs'],
    queryFn: () =>
      fetchPosts({
        isPosts: false,
        isPublic: true
      })
  })

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update()
    }
  }, [data])

  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const theme = useTheme()
  const Img = styled('img')({
    width: '100%',
    height: 'auto',
    maxWidth: '100%'
  })

  return (
    <div className='grid sm:grid-cols-2 grid-rows-1 p-10 grid-cols-1 gap-2 '>
      {data && data.length > 0 && (
        <div>
          <Typography className='text-center' variant='h4'>
            {t('news')}
          </Typography>
          <Grid
            sx={{
              // border: '1px solid #e0e0e0',
              borderRadius: '5px'

              // padding: '1rem'
            }}
            container
            spacing={2}
            columnGap={1}
            rowGap={2}
          >
            <Grid item xs={12}>
              <Card variant='outlined'>
                <img src={process.env.NEXT_PUBLIC_API_URP + '/' + data[0].url} width={'100%'} />
                <CardContent>
                  <Typography
                    sx={{ mb: 2 }}
                    className='underline  cursor-pointer '
                    color={'primary'}
                    onClick={() => {
                      window.location.href = `/news/${data[0].id}`
                    }}
                  >
                    {t(data[0].title)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {data.slice(1, 3).map((item, index) => (
              <Grid sm={5.93} xs={12} key={index}>
                <Card variant='outlined'>
                  <CardMedia sx={{ height: '16rem' }} image={process.env.NEXT_PUBLIC_API_URP + '/' + item.url} />
                  <CardContent
                    sx={{
                      height: '90px'
                    }}
                  >
                    <Typography
                      sx={{ mb: 2 }}
                      className='underline cursor-pointer  '
                      color={'primary'}
                      onClick={() => {
                        window.location.href = `/news/${item.id}`
                      }}
                    >
                      {t(item.title)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <div className='flex justify-center items-center'>
            <Link
              href={`/news`}
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                mt: 2
              }}
            >
              {t('savoir plus')}
            </Link>
          </div>
        </div>
      )}

      <div>
        <Typography className='text-center' variant='h4'>
          {t('Videos')}
        </Typography>
        <div className='flex flex-col gap-3'>
          <Grid item xs={12}>
            <Card variant='outlined'>
              <iframe
                src='https://www.youtube.com/embed/XW3sldkzi1I?si=FUaPwUF1lvDed32d'
                className='border border-gray-500  rounded-sm object-cover w-full h-full aspect-video'
              />
              <CardContent>
                <Typography sx={{ mb: 2 }} className='underline cursor-pointer  ' color={'primary'}></Typography>
              </CardContent>
            </Card>
          </Grid>
          <div
            className='flex  justify-between'
            sx={{
              height: '90px'
            }}
          >
            <div className='flex '>
              <Card variant='outlined'>
                <iframe
                  src='https://www.youtube.com/embed/ZKez8NQngeg?si=EXL-bJsoKaquhlIv'
                  className='border border-gray-500  rounded-sm object-cover h-full w-full '
                  title='Video 1'
                />
              </Card>
            </div>

            <div className='flex   '>
              <Card variant='outlined'>
                <iframe
                  src='https://www.youtube.com/embed/hcqECua096k?si=nia4r8QbVlnfB_39'
                  className='border border-gray-500  rounded-sm object-cover h-full w-full '
                  title='Video 2'
                />
                <CardContent
                  sx={{
                    height: '100px'
                  }}
                >
                  <Typography sx={{ mb: 2 }} className='underline cursor-pointer  ' color={'primary'}></Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <Typography className='text-center' variant='h4'>
          {t('Publications')}
        </Typography>
        <div className='flex flex-col gap-3'>
          {docs?.data.map(item => (
            <Card
              variant='outlined'
              key={item.id}
              sx={{
                minHeight: '5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                padding: '1rem'
              }}
            >
              <Typography
                className='underline cursor-pointer  '
                color={'primary'}
                onClick={() => {
                  window.location.href = `/news/${item.id}`
                }}
              >
                {t(item.title)}
              </Typography>
            </Card>
          ))}
        </div>
        <div className='flex justify-center items-center'>
          <Link
            href={`/docs`}
            sx={{
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              mt: 2
            }}
          >
            {t('savoir plus')}
          </Link>
        </div>
      </div> */}
    </div>
  )
}
