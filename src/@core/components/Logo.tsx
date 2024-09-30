import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { logos } from 'src/configs/constant'

export function Logo() {
  const { i18n } = useTranslation()
  const [width, setWidth] = useState(0)

  // useEffect(() => {
  //   setWidth(window.innerWidth)
  //   window.addEventListener('resize', () => {
  //     setWidth(window.innerWidth)
  //   })
  // }, [])

  useEffect(() => {
    // Only access window inside useEffect
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // const locale = i18n.language

  return (
    <>
      {/* // <Image
    //   width={width < 768 ? 310 : 450}
    //   height={width < 768 ? 85 : 102}
    //   src={width > 768 ? `/logos/l_${locale}.png` : `/logos/s_${locale}.png`}
    //   alt='Logo'
    // /> */}

      <Image width={width < 768 ? 310 : 150} height={width < 768 ? 85 : 40} src={`/images/sv (2).png`} alt='Logo' />
    </>
  )
}
