import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { logos } from 'src/configs/constant'

export function Logo() {
  const { i18n } = useTranslation()
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    setWidth(window.innerWidth)
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])
  const locale = i18n.language

  return (
    <>
      {/* // <Image
    //   width={width < 768 ? 310 : 450}
    //   height={width < 768 ? 85 : 102}
    //   src={width > 768 ? `/logos/l_${locale}.png` : `/logos/s_${locale}.png`}
    //   alt='Logo'
    // /> */}

      <Image
        width={width < 768 ? 310 : 150}
        height={width < 768 ? 85 : 40}
        src={width > 768 ? `/images/sv (2).png` : `/logos/s_${locale}.png`}
        alt='Logo'
      />
    </>
  )
}
