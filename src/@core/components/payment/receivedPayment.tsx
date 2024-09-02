import Table from 'src/@core/utilities/table/table'
import Button from 'src/@core/utilities/button/button'
import { MdCheckBoxOutlineBlank } from 'react-icons/md'
import { FaDownload } from 'react-icons/fa'

const months = ['Janvier 2019', 'Fevrier 2019', 'Mars 2019', 'Avril 2019', 'Mai 2019', 'Juin 2019']
const labels = ["CLASSE D'ENTITE", 'Trim. I 2020', 'Trim. II 2021', 'Trim. II 2022', 'Trim. II 2023']
const detailsJson = [
  {
    name: 'Guidimakha Guidimakha',
    values: [12, 24, 40, 35],
    id: 1
  },
  {
    name: 'Accouchement eutocique assisté par un personnel qualifié indigent',
    values: [238, 299, 568, 855],
    id: 1
  },
  {
    name: 'Hodel Harbi',
    values: [12, 24, 10, 35],
    id: 2
  },
  {
    name: 'Hodel Chargy',
    values: [19, 24, 28, 9],
    id: 3
  },
  {
    name: 'Etrarza',
    values: [10, 24, 28, 9],
    id: 3
  },
  {
    name: 'Atar',
    values: [11, 21, 208, 9],
    id: 3
  },
  {
    name: 'Nouakchott',
    values: [112, 214, 200, 405],
    id: 4
  }
]

const ReceivedPayment = () => {
  return (
    <div className='mt-10'>
      <div className='flex justify-between border-b items-center'>
        <h2 className='text-2xl'>Paiements reçus</h2>
        <MdCheckBoxOutlineBlank />
      </div>
      <div className='overflow-x-auto mb-4'>
        <Table columns={labels} rows={detailsJson} className='h-96' />
      </div>
      {/* <div className='mt-4'>
        <Button className='btn bg-blue-400 hover:bg-blue-600 text-white shadow-md uppercase mr-2'>
          <MdCheckBoxOutlineBlank />
          Tous les paiements
        </Button>
        <Button className='btn bg-red-600 hover:bg-primary-600 text-white shadow-md uppercase'>
          <FaDownload />
          Export
        </Button>
      </div> */}
    </div>
  )
}

export default ReceivedPayment
