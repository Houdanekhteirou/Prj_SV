import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { filterZone } from 'src/api/other' // Ensure this import path is correct

const WilayaManagement = () => {
  const [leftList, setLeftList] = useState([])
  const [rightList, setRightList] = useState([])
  const [selectedWilaya, setSelectedWilaya] = useState(null)
  const [expandedWilaya, setExpandedWilaya] = useState(null)
  const [expandedMoughataa, setExpandedMoughataa] = useState(null)
  const [selectedMoughataa, setSelectedMoughataa] = useState([])
  const [selectedZoneSanitaire, setSelectedZoneSanitaire] = useState([])

  // Fetch all Wilaya
  const {
    data: allWilaya,
    isLoading: isLoadingWilayaa,
    error: errorWilaya
  } = useQuery({
    queryKey: ['wilaya'],
    queryFn: async () => {
      const res = await filterZone(1)

      return res?.data
    }
  })

  // Fetch Moughataa based on expanded Wilaya
  const {
    data: allMoughataa,
    isLoading: isLoadingMoughataa,
    error: errorMoughataa
  } = useQuery({
    queryKey: ['moughataa', expandedWilaya],
    queryFn: async () => {
      const res = await filterZone(expandedWilaya)

      return res?.data
    },
    enabled: !!expandedWilaya
  })

  // Fetch Zone Sanitaire based on expanded Moughataa
  const {
    data: allZoneSanitaire,
    isLoading: isLoadingZoneSanitaire,
    error: errorZoneSanitaire
  } = useQuery({
    queryKey: ['zoneSanitaire', expandedMoughataa],
    queryFn: async () => {
      const res = await filterZone(expandedMoughataa)

      return res?.data
    },
    enabled: !!expandedMoughataa
  })

  // Initialize left list with wilaya data
  useEffect(() => {
    if (Array.isArray(allWilaya)) {
      setLeftList(allWilaya.map(wilaya => ({ name: wilaya.name, id: wilaya.id, active: false, type: 'wilaya' })))
    }
  }, [allWilaya])

  const moveItems = (fromList, setFromList, toList, setToList, types) => {
    const activeItems = fromList.filter(item => item.active && types.includes(item.type))

    // Check if all Moughataa under a Wilaya are selected, transfer Wilaya
    if (types.includes('moughataa') && expandedWilaya && activeItems.length === allMoughataa.length) {
      activeItems.push(...fromList.filter(item => item.id === expandedWilaya && item.type === 'wilaya'))
    }

    if (activeItems.length > 0) {
      setFromList(fromList.filter(i => !i.active || !types.includes(i.type)))
      setToList([...toList, ...activeItems.map(item => ({ ...item, active: false }))])
    }
  }

  const handleClickName = (item, fromList, setFromList, setSelected) => {
    const updatedList = fromList.map(i => ({
      ...i,
      active: i.id === item.id ? !i.active : i.active
    }))
    setFromList(updatedList)
    if (item.type === 'wilaya') {
      setSelected(item.id === selectedWilaya ? null : item.id)
    } else if (item.type === 'moughataa') {
      setSelectedMoughataa(prev => (prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]))
    } else if (item.type === 'zoneSanitaire') {
      setSelectedZoneSanitaire(prev =>
        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
      )
    }
  }

  const handleToggle = (item, setExpanded) => {
    setExpanded(item.id === expandedWilaya ? null : item.id)
  }

  const handleMoughataaClick = moughataa => {
    setExpandedMoughataa(moughataa.id === expandedMoughataa ? null : moughataa.id)
  }

  if (isLoadingWilayaa || isLoadingMoughataa || isLoadingZoneSanitaire) {
    return <div>Loading...</div>
  }

  if (errorWilaya || errorMoughataa || errorZoneSanitaire) {
    return <div>Error loading data</div>
  }

  return (
    <div className='flex space-x-4'>
      <Card
        title='Card1'
        list={leftList}
        onNameClick={item => handleClickName(item, leftList, setLeftList, setSelectedWilaya)}
        onToggle={item => handleToggle(item, setExpandedWilaya)}
        onMoveItems={() =>
          moveItems(leftList, setLeftList, rightList, setRightList, ['wilaya', 'moughataa', 'zoneSanitaire'])
        }
        allMoughataa={allMoughataa}
        allZoneSanitaire={allZoneSanitaire}
        onMoughataaNameClick={item => handleClickName(item, leftList, setLeftList, setSelectedWilaya)}
        onZoneSanitaireToggle={handleMoughataaClick}
        expandedWilaya={expandedWilaya}
        expandedMoughataa={expandedMoughataa}
        selectedMoughataa={selectedMoughataa}
        selectedZoneSanitaire={selectedZoneSanitaire}
      />
      <div className='flex flex-col justify-center'>
        <button
          className='text-2xl'
          onClick={() =>
            moveItems(leftList, setLeftList, rightList, setRightList, ['wilaya', 'moughataa', 'zoneSanitaire'])
          }
        >
          →
        </button>
        <button
          className='text-2xl mt-2'
          onClick={() =>
            moveItems(rightList, setRightList, leftList, setLeftList, ['wilaya', 'moughataa', 'zoneSanitaire'])
          }
        >
          ←
        </button>
      </div>
      <Card
        title='Card2'
        list={rightList}
        onNameClick={item => handleClickName(item, rightList, setRightList, setSelectedWilaya)}
        onToggle={item => handleToggle(item, setExpandedWilaya)}
        onMoveItems={() =>
          moveItems(rightList, setRightList, leftList, setLeftList, ['wilaya', 'moughataa', 'zoneSanitaire'])
        }
        allMoughataa={allMoughataa}
        allZoneSanitaire={allZoneSanitaire}
        onMoughataaNameClick={item => handleClickName(item, rightList, setRightList, setSelectedWilaya)}
        onZoneSanitaireToggle={handleMoughataaClick}
        expandedWilaya={expandedWilaya}
        expandedMoughataa={expandedMoughataa}
        selectedMoughataa={selectedMoughataa}
        selectedZoneSanitaire={selectedZoneSanitaire}
      />
    </div>
  )
}

const Card = ({
  title,
  list,
  onNameClick,
  onToggle,
  onMoveItems,
  allMoughataa,
  allZoneSanitaire,
  onMoughataaNameClick,
  onZoneSanitaireToggle,
  expandedWilaya,
  expandedMoughataa,
  selectedMoughataa,
  selectedZoneSanitaire
}) => (
  <div className='bg-white p-4 rounded-lg shadow-md w-1/2'>
    <h2 className='text-xl font-bold mb-4'>{title}</h2>
    <ul>
      {list.map(item => (
        <li key={item.id} className={`p-2 border-b ${item.active ? 'bg-green-200' : ''}`}>
          <span className='cursor-pointer' onClick={() => onToggle(item)}>
            {item.id === expandedWilaya || item.id === expandedMoughataa ? '-' : '>'}
          </span>
          <span className='cursor-pointer' onClick={() => onNameClick(item)}>
            {' '}
            {item.name}{' '}
          </span>
          {item.type === 'wilaya' && item.id === expandedWilaya && allMoughataa && (
            <ul className='ml-4'>
              {allMoughataa.map(moughataa => (
                <li
                  key={moughataa.id}
                  className={`ml-2 p-1 ${selectedMoughataa.includes(moughataa.id) ? 'bg-blue-200' : ''}`}
                >
                  <span className='cursor-pointer' onClick={() => onZoneSanitaireToggle(moughataa)}>
                    {moughataa.id === expandedMoughataa ? '-' : '>'}
                  </span>
                  <span className='cursor-pointer' onClick={() => onMoughataaNameClick(moughataa)}>
                    {' '}
                    {moughataa.name}{' '}
                  </span>
                  {moughataa.id === expandedMoughataa && allZoneSanitaire && (
                    <ul className='ml-4'>
                      {allZoneSanitaire.map(zone => (
                        <li
                          key={zone.id}
                          className={`ml-2 p-1 ${selectedZoneSanitaire.includes(zone.id) ? 'bg-red-200' : ''}`}
                        >
                          <span className='cursor-pointer' onClick={() => onMoughataaNameClick(zone)}>
                            {' '}
                            {zone.name}{' '}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
    <button className='mt-2' onClick={onMoveItems}>
      {title === 'Card1' ? 'Move Right' : 'Move Left'}
    </button>
  </div>
)

export default WilayaManagement
