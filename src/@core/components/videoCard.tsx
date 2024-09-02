import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function VideoCard() {
  const [videos, setVideos] = useState(null)
  const { i18n } = useTranslation()
  const { language } = i18n

  useEffect(() => {
    switch (language) {
      case 'fr':
        setVideos({
          first: 'https://www.youtube.com/embed/NUQ8exb3iSY?si=_OmPx-bsXzRLRFUx',
          second: 'https://www.youtube.com/embed/JexIYaoEvrI?si=AnoOw6ujR_lj4ARQ',
          third: 'https://www.youtube.com/embed/ZKez8NQngeg?si=gill-X9JR_DOSoZA'
        })
        break
      case 'ar':
        setVideos({
          first: 'https://www.youtube.com/embed/ZKez8NQngeg?si=gill-X9JR_DOSoZA',
          second: 'https://www.youtube.com/embed/tM1eZ2x7ndI?si=qshmVXVIhC0_h5is',
          third: 'https://www.youtube.com/embed/lwNzF9E-9tE?si=9ifX-2iGsMxSsraN'
        })
        break
    }
  }, [language])

  return (
    <div className='grid grid-cols-1  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 sm:grid-rows-4 gap-4'>
      <div className='col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-5  row-span-4 col-start-1 '>
        <iframe src={videos?.first} className='border  rounded-sm object-cover w-full h-full' title='Video 3' />
      </div>
      <div className='col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 row-span-2 col-start-1 sm:col-start-3 md:col-start-4 lg:col-start-6 xl:col-start-6 '>
        <iframe src={videos?.second} className='border  rounded-sm object-cover w-full h-full' title='Video 2' />
      </div>
      <div className='col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 row-span-2 col-start-1 sm:col-start-3 md:col-start-4 lg:col-start-6 xl:col-start-6 row-start-3'>
        <iframe
          src={videos?.third}
          className='border  rounded-sm object-cover w-full h-full aspect-video'
          title='First Video'
        />
      </div>
    </div>
  )
}
