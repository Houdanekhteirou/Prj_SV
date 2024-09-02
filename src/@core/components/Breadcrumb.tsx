import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const Breadcrumb = () => {
  const { t } = useTranslation()

  const pathname = usePathname()
  const segments = pathname
    .split('/')
    .filter(s => s !== '')
    .filter(el => !['en', 'fr', 'ar'].includes(el))

  return (
    <nav className='flex mx-auto mb-16' aria-label='Breadcrumb'>
      <ol role='list' className='flex space-x-4 rounded-md bg-white px-6 shadow'>
        <li className='flex'>
          <div className='flex items-center'>
            <a href='/' className='text-gray-400 hover:text-gray-500'>
              <span className='sr-only'>Home</span>
            </a>
          </div>
        </li>
        {segments.map((segment, index) => {
          const current = index === segments.length - 1
          const path = `/${segments.slice(0, index + 1).join('/')}`

          return (
            <li key={segment} className='flex'>
              <div className='flex items-center'>
                <svg
                  className='h-full w-6 flex-shrink-0 text-gray-200'
                  viewBox='0 0 24 44'
                  preserveAspectRatio='none'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
                </svg>
                {current ? (
                  <span className='ml-4 text-sm font-medium text-gray-500 select-none' aria-current='page'>
                    {t(segment)}
                  </span>
                ) : (
                  <a href={path} className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
                    {t(segment)}
                  </a>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
