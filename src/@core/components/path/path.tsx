'use client'
import { usePathname } from 'next/navigation'

const Path = ({ path }: { path?: string[] }) => {
  const pathName = usePathname()
  //const currentPathList: string[] = path ? path : pathName.split('/').slice(2)

  return (
    <div className='breadcrumbs'>
      <ul className='text-sm'>
        <li>
          <span>Test</span>
        </li>
      </ul>
    </div>
  )
}

export default Path
