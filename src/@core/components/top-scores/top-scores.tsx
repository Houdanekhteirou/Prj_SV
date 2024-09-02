const TopScores = () => {
  return (
    <div className='grid grid-cols-2 grid-rows-1 bg-gray-50 mt-10' style={{ backgroundColor: '#F4F4F4' }}>
      <div>Indisponible</div>
      <div className='pr-4'>
        <h3 className='divider divider-neutral text-lg px-2 text-primary'>TOP SCORE DE LA QUALITÉ ( Q 3 2023 )</h3>
        <div className='flex justify-between bg-white pr-4 mb-2'>
          <ul className='menu'>
            <li>
              <a className='hover:text-error hover:bg-white text-lg'>
                (2) <span className='text-primary'>PS SOUVI (PS)</span>
              </a>
            </li>
          </ul>
          <div className='flex bg-green-600 justify-center items-center text-white rounded-full w-16 h-16'>72%</div>
        </div>
        <div>
          <table className='table'>
            <thead>
              <tr className='text-white text-lg bg-gray-400 rounded-t-lg'>
                <th>Name</th>
                <th className='text-end'>global</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b'>
                <th className='cursor-pointer'>
                  (1) <span className='text-primary'>PS Chleikha (PS) </span>
                </th>
                <td className='text-end'>68%</td>
              </tr>
              <tr className='border-b'>
                <th className='cursor-pointer'>
                  (2) <span className='text-primary'>PS Diaguily (PS)</span>
                </th>
                <td className='text-end'>60%</td>
              </tr>
              <tr className='border-b'>
                <th className='cursor-pointer'>
                  (3) <span className='text-primary'>CS M’Bera (CS)</span>
                </th>
                <td className='text-end'> 71%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TopScores
