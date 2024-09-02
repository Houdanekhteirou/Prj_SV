'use client'

import { usePathname, useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import HorizontalNavLink from '../layouts/components/horizontal/navigation/HorizontalNavLink'
import LanguageDropdown from '../layouts/components/shared-components/LanguageDropdown'
import { classNames, getLogo } from '../utils'
import { Logo } from './Logo'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const NaveBar = () => {
  const { settings, saveSettings } = useSettings()

  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const pathname = usePathname()
  const router = useRouter()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])

  const [navigation] = useState([
    {
      title: t('home'),
      path: `/`,
      icon: 'mdi:home-outline'
    },
    {
      title: t('about'),
      path: `/about`,
      icon: 'fe:question'
    },
    {
      title: t('data_pbf'),
      path: `/stats`,
      icon: 'nimbus:stats'
    },
    {
      title: t('Publications'),
      path: `/docs`,
      icon: 'fluent:document-folder-24-regular'
    }
  ])

  const onAction = () => router.push('/admin')

  const openMenu = () => {
    document?.getElementById('menu').classList.toggle('hidden')
  }

  // if the screen is small, return the mobile version
  if (width < 768) {
    return (
      <nav className='flex flex-col'>
        <div
          className='
           flex
           items-center
           justify-around
           w-full
           py-4
           md:py-0
           text-lg text-gray-700
           bg-white
           border-b-2
           border-yellow-400
         '
        >
          {' '}
          <LinkStyled href='/'>
            <Logo />
          </LinkStyled>{' '}
          <div>
            <LanguageDropdown saveSettings={saveSettings} settings={settings} />
          </div>
          {/* <Button
            sx={{
              alignSelf: 'center'
            }}
            onClick={onAction}
          >
            <IconifyIcon icon='gravity-ui:lock' color='red' />
          </Button>
          <IconifyIcon icon='ic:round-menu' onClick={openMenu} fontSize={'55px'} /> */}
        </div>

        <div className='hidden w-full' id='menu'>
          {/* <div className='flex-col flex items-center w-full'>
            {navigation.map((el, idx) => (
              <Link
                key={idx}
                href={el.path}
                prefetch={true}
                onClick={openMenu}
                className={classNames(
                  'inline-flex items-center border-b-2  border-transparent px-1 pt-1 text-sm font-medium text-gray-50 hover:border-gray-100 hover:text-gray-white',
                  pathname === el.path ? 'border-red-700 bold ' : ''
                )}
              >
                <HorizontalNavLink item={el} settings={settings} hasParent={false} />
              </Link>
            ))}
          </div> */}
        </div>
      </nav>
    )
  } else if (width < 1270) {
    return (
      <nav
        className='
           flex
           flex-col
           items-center
           w-full

           text-lg text-gray-700
           bg-white
           border-b-2
           border-yellow-400
         '
        id='navbar-90'
      >
        {' '}
        <div className='flex flex-row  justify-between w-full'>
          <LinkStyled href='/'>
            <Logo />
          </LinkStyled>{' '}
          <div className='flex'>
            <div className='self-center'>
              <LanguageDropdown saveSettings={saveSettings} settings={settings} />
            </div>
            {/* <Button
              sx={{
                height: 40,
                backgroundColor: '#d4141c !important',
                alignSelf: 'center'
              }}
              onClick={onAction}
              startIcon={<IconifyIcon icon='gravity-ui:lock' color='white' />}
            >
               <IconifyIcon icon='ic:outline-settings' onClick={onAction} />
              <span className='text-white'>{t('management')}</span>
            </Button> */}
          </div>
        </div>
        <div className='w-full md:flex md:items-center md:w-auto self-end' id='menu'>
          {/* <div className='lg:flex'>
            {navigation.map((el, idx) => (
              <Link
                key={idx}
                href={el.path}
                prefetch={true}
                className={classNames(
                  'inline-flex items-center border-b-2  border-transparent px-1 pt-1 text-sm font-medium text-gray-50 hover:border-gray-100 hover:text-gray-white',
                  pathname === el.path ? 'border-red-700 bold ' : ''
                )}
              >
                <HorizontalNavLink item={el} settings={settings} hasParent={false} />
              </Link>
            ))}
          </div> */}
        </div>
      </nav>
    )
  }

  return (
    <nav
      className='
         flex
         sm:flex-col
         xl:flex-row
         items-center
         justify-between
         w-full
         lg:px-10   px-2 md:px-4
         text-lg text-gray-700
         bg-white
         border-b-2
         border-green-400
       '
      id='navbar-90'
    >
      {' '}
      <LinkStyled href='/'>
        <Logo />
      </LinkStyled>{' '}
      <div className='w-full md:flex md:items-center md:w-auto ' id='menu'>
        <div className='lg:flex'>
          {/* {navigation.map((el, idx) => (
            <Link
              key={idx}
              href={el.path}
              prefetch={true}
              className={classNames(
                'inline-flex items-center border-b-2  border-transparent px-1 pt-1 text-sm font-medium text-gray-50 hover:border-gray-100 hover:text-gray-white',
                pathname === el.path ? 'border-red-700 bold ' : ''
              )}
            >
              <HorizontalNavLink item={el} settings={settings} hasParent={false} />
            </Link>
          ))} */}
          <div className='hidden md:contents self-center'>
            <LanguageDropdown saveSettings={saveSettings} settings={settings} />
          </div>
          {/* <Button
            sx={{
              height: 40,
              backgroundColor: '#d4141c !important',
              alignSelf: 'center'
            }}
            onClick={onAction}
            startIcon={<IconifyIcon icon='gravity-ui:lock' color='white' />}
          >
            {/* <IconifyIcon icon='ic:outline-settings' onClick={onAction} />
            <span className='text-white'>{t('management')}</span>
          </Button> */}
        </div>
      </div>
    </nav>
  )
}

export default NaveBar
