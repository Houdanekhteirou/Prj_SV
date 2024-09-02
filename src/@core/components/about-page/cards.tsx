import { Typography } from '@mui/material'
import { text } from 'stream/consumers'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

export const CardOrganisation = ({ title, description, image }) => {
  return (
    <div
      className='flex items-center gap-4'
      style={{
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <div className='p-4 bg-white rounded-full flex items-center justify-center'>
        <Image src={image} alt='Random image' height={45} width={45} />
      </div>
      <div
        className='flex flex-col gap-4 w-full '
        style={{
          maxWidth: '500px'
          // on small screens max width is 300px
        }}
      >
        <Typography
          style={{
            fontSize: '1.3rem',
            fontWeight: 'bold'
          }}
          color={'red'}
          className='text-start  mt-10 '
        >
          {title}
        </Typography>
        <p
          style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: 'grey'
          }}
          className='text-justify  mt-10'
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
    </div>
  )
}

export const Card1 = ({ titles, descriptions, image }) => {
  const { t, i18n } = useTranslation()

  return (
    <div className='flex items-center gap-3 p-2 sm:p-0'>
      <Image src={`${process.env.NEXT_PUBLIC_API_URP}/${image}`} alt='Random image' height={40} width={40} />
      <div className='flex flex-col border-l-2 border-red-500 pl-2'>
        <div className='flex items-center gap-3'>
          {titles.map((title, index) => (
            <Typography
              sx={{
                fontWeight: 'bold',
                color: '#4CAF50',
                fontSize: '1.2rem'
              }}
              color={'green'}
              key={index}
            >
              {t(title)}
            </Typography>
          ))}
        </div>
        <div className='flex  gap-3'>
          {descriptions.map((description, index) => (
            <Typography
              sx={{
                color: 'grey',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
              key={index}
            >
              {t(description)}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Card2 = ({ title, pourcentage, total, image, isLastOne = false }) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const locale = i18n.language

  if (locale === 'ar')
    return (
      <div className='flex flex-row items-center cursor-pointer justify-between '>
        {/* {!isLastOne && <hr className='h-full w-0.5  border-0 bg-gray-400 ml-16' />} */}

        <div className='flex flex-col sm:items-end items-center cursor-pointer'>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
            className='sm:text-end text-center'
          >
            {pourcentage}%
          </Typography>
          <Typography className='sm:text-end text-center' variant='h3' color={'primary'}>
            {total}
          </Typography>
          <p>{title}</p>
        </div>
        <Image alt='img1' height={40} width={40} src={`${process.env.NEXT_PUBLIC_API_URP}/${image}`} />
      </div>
    )

  return (
    <div className='flex flex-row items-center cursor-pointer '>
      <Image alt='img1' height={40} width={40} src={`${process.env.NEXT_PUBLIC_API_URP}/${image}`} />
      <div className='flex flex-col sm:items-end items-center cursor-pointer'>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}
          className='sm:text-end text-center'
        >
          {pourcentage}%
        </Typography>
        <Typography className='sm:text-end text-center' variant='h3' color={'primary'}>
          {total}
        </Typography>
        <p>{t(title)}</p>
      </div>
      {/* {!isLastOne && <hr className='h-full w-0.5  border-0 bg-gray-400 ml-16' />} */}
    </div>
  )
}

export const Card3 = ({ title, pourcentage, number }) => {
  const { t } = useTranslation()

  return (
    <div>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}
      >
        {pourcentage}%
      </Typography>
      <div className='flex flex-row items-center  gap-4'>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '3.5rem'
          }}
          color={'primary'}
        >
          {number}
        </Typography>
        <Typography variant='h5' color={'grey'}>
          {t(title)}
        </Typography>
      </div>
    </div>
  )
}
