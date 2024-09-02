const ScoresDetails = ({ rows, columns, popupPosition }) => {
  return (
    <div
      className='popup-chart-container p-5 absolute'
      style={{ top: popupPosition.top, left: popupPosition.left + 400, width: '750px' }}
    >
      <table className='table table-lg table-pin-rows'>
        <thead>
          <tr className='bg-green-600'>
            {columns.map((label, index) => (
              <th key={index}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={index} className='hover:text-rose-600'>
              <th className={`${index === 0 ? 'text-black bg-red-500' : 'text-primary bg-white'}`}>{item.name}</th>
              {item.values.map((value, index) => (
                <td
                  className={value === 0 ? 'bg-red-600' : value % 2 === 0 ? 'bg-blue-600' : 'bg-orange-500'}
                  key={index}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScoresDetails
