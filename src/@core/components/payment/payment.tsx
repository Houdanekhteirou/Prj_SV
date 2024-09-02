import Table from 'src/@core/utilities/table/table'
import { FaMale } from 'react-icons/fa'
import { FaFileExport } from 'react-icons/fa'
import Button from '../../utilities/button/button'

const score = [
  {
    quality: 'Qualité Niveau Communautaire',
    percentage: '50%'
  },
  {
    quality: 'Qualité PCA',
    percentage: '69%'
  },
  {
    quality: 'Qualité PMA',
    percentage: '66%'
  },
  {
    quality: 'Qualité PMA PS Principal',
    percentage: '59%'
  },
  {
    quality: 'Qualité PMA PS Secondaire',
    percentage: '34%'
  }
]
const Payment = () => {
  return (
    <div className='grid grid-cols-300-2 pt-10'>
      <h5 className='font-semibold font-xl'>Score de qualité</h5>
      <h5 className='font-semibold font-xl'>Paiements reçus</h5>
      <hr className='h-px bg-gray-200 dark:bg-gray-700 col-span-full' style={{ marginTop: '-30px' }} />
      <Table>
        {score.map((item, index) => (
          <tr key={index} className={`border-dashed ${index !== score.length - 1 ? 'border-b-1' : ''}`}>
            <td className='inline-flex items-start'>
              <p>{item.quality}</p>
              <strong className='text-primary ml-2'>{item.percentage}</strong>
            </td>
          </tr>
        ))}
      </Table>
      <div className='grid grid-cols-300-2'>
        <ul className='list-none flex flex-col gap-y-10 items-center border-t pt-5 border-l'>
          <li className='flex flex-col cursor-pointer items-center'>
            <img src='/img/icon-total.png' className='h-16 w-16' />
            <strong className='text-primary hover:text-red-600'>1278899MRE</strong>
            <strong className='text-primary hover:text-red-600'>1278899$</strong>
          </li>
          <li className='flex flex-col cursor-pointer items-center'>
            <FaMale className='h-16 w-16' />
            <strong className='text-primary hover:text-red-600'>1278899MRE</strong>
            <strong className='text-primary hover:text-red-600'>1278899$</strong>
          </li>
        </ul>
      </div>
      <div className='col-span-full m-auto'>
        <Button className='btn bg-red-600 hover:bg-primary-600 text-white rounded-full shadow-md'>
          <FaFileExport />
          Export Global
        </Button>
      </div>
    </div>
  )
}

export default Payment
