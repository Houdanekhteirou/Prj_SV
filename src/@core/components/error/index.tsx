// ** MUI Imports
import { BoxProps } from '@mui/material/Box'

const FallbackError = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook

  return (
    <div className='w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0'>
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center'>
        <p className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider text-gray-300'>500</p>
        <p className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-gray-300 mt-2'>Server Error</p>
        <p className='text-lg md:text-xl lg:text-2xl text-gray-500 my-12'>Contacter l'equipe de developement </p>
      </div>
    </div>
  )
}

export default FallbackError
