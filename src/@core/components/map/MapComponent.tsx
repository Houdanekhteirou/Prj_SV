import { useEffect, useMemo, useState } from 'react'
import { MapContainer } from 'react-leaflet'

import { Icon } from '@iconify/react'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import L from 'leaflet'
import 'leaflet-boundary-canvas'
import 'leaflet/dist/leaflet.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { formatNumber } from 'src/@core/utils'
import { get_entity, get_zone } from 'src/api/select_filters'
import getGeoJson from './a'
import geoJSON from './mr.json'

export default function MapComponent({ allWilaya }) {
  const [map, setMap] = useState<L.Map | null>(null)
  const [mapType, setMapType] = useState(0)
  const GeoDataOld = getGeoJson()
  const { t, locale } = useTranslation()

  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const [entity, setEntity] = useState<string | null>(null)
  const [selectedZoneData, setSelectedZoneData] = useState<any>(null)

  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth)
    })
  }, [])

  useEffect(() => {
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none'
  }, [])

  const { data: allMoughataa, isLoading: isLoadingMoughataa } = useQuery({
    queryKey: ['moughataa_map', wilaya],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 4,
        parentId: wilaya
      })

      return res
    },
    enabled: !!wilaya
  })

  const { data: allZoneSanitaire, isLoading: isLoadingZoneSanitaire } = useQuery({
    queryKey: ['zoneSanitaire_map', moughataa],
    queryFn: async () => {
      const res = await get_zone({
        levelId: 5,
        parentId: moughataa
      })

      return res
    },
    enabled: !!moughataa
  })

  const { data: allEntities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities_map', zoneSanitaire],
    queryFn: async () => {
      const res = await get_entity({
        zone_id: zoneSanitaire,
        entityClassId: 1
      })

      return res
    },
    enabled: !!zoneSanitaire
  })

  const DataTotal = useMemo(() => {
    const numberWilayaa = GeoDataOld.willaya.features.length
    const numberMoughataa = GeoDataOld.moughataa.features.length
    const numberZoneSanitaire = GeoDataOld.aire_sante.features.length
    const numberEntity = GeoDataOld.entity.features.length
    const numberHospitals = GeoDataOld.willaya.features.reduce((acc, item) => acc + item.properties.hospitals, 0)
    const numberCS = GeoDataOld.willaya.features.reduce((acc, item) => acc + item.properties.CS, 0)
    const numberPS = GeoDataOld.willaya.features.reduce((acc, item) => acc + item.properties.PS, 0)
    const numberPopulation = GeoDataOld.willaya.features.reduce((acc, item) => acc + item.properties.geozone_pop, 0)

    return {
      title: t('Donner general'),
      data: [
        {
          title: t('Wilayaas'),
          value: numberWilayaa
        },
        {
          title: t('Moughataas'),
          value: numberMoughataa
        },
        {
          title: t('Population'),
          value: formatNumber(numberPopulation)
        },
        {
          title: t('structre_sanitaire'),
          value: numberPS + numberCS + numberHospitals
        },
        {
          subtitle: t('Hospitals'),
          value: numberHospitals
        },
        {
          subtitle: t('centre_sante'),
          value: numberCS
        },
        {
          subtitle: t('poste_sante'),
          value: numberPS
        }
      ]
    }
  }, [GeoDataOld])

  const textStyleDir = useMemo(() => (locale === 'ar' ? 'text-align:right;' : ''), [])

  useEffect(() => {
    L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag, !L.Browser.mobile)

    const createTileLayer = () => {
      const tileLayer =
        mapType === 0
          ? L.TileLayer.boundaryCanvas('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              boundary: geoJSON,
              attribution: null
              // make the zoom 6
            })
          : L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
              attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,

              id: 'mapbox/satellite-v9',
              tileSize: 512,
              zoomOffset: -1,
              accessToken: 'pk.eyJ1IjoiaGFmZWRtaWgiLCJhIjoiY2wzZjVtbmZmMDVvOTNrbnhmMmgxZHF1MiJ9.l1lFW_2Ngqj7Y6tKpia6Lg'
            })

      return tileLayer
    }

    const clearMapLayers = () => {
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer)
        }
      })
    }

    const toggleMapType = () => {
      setMapType(mapType === 0 ? 1 : 0)
    }

    const addLegendControl = () => {
      const legend = L.control({ position: 'topright' })
      legend.onAdd = function (map) {
        if (document.getElementsByClassName('info-legend'))
          for (let i = 0; i < document.getElementsByClassName('info-legend').length; i++) {
            document.getElementsByClassName('info-legend')[i].remove()
          }
        const div = L.DomUtil.create('div', 'info-legend')
        div.innerHTML = `<div class=' opacity-90  flex justify-end flex-col'>
          <div class='relative p-1'>
            <img src=${
              mapType === 0 ? '/images/layer2.png' : '/layer1.jpg'
            } class=' w-14 border border-gray-600 cursor-pointer ' />
            <span class="absolute top-2 border border-gray-50 bg-gray-50 px-1  text-black rounded-md   transform -translate-x-1/2 opacity-0 transition duration-300 pointer-events-none">${
              mapType === 0 ? t('mode satellite') : ''
            }</span>
          </div>
          <div class='flex flex-col gap-2 bg-white mt-4 p-1 opacity-75' id='zoneCouverte'>
            <div class='w-14 h-3 bg-green-700 bg-opacity-45 border-2 border-green-700  '></div>
            <div style='font-size: 9px;' class='text-black'>${t('Zone couverte')} </div>
          </div>
          </div>

          `

        div.onclick = toggleMapType
        div.addEventListener('mouseenter', function () {
          div.querySelector('span').classList.remove('opacity-0')
        })

        div.addEventListener('mouseleave', function () {
          div.querySelector('span').classList.add('opacity-0')
        })

        return div
      }
      legend.addTo(map)
    }

    if (map) {
      clearMapLayers()
      const tileLayer = createTileLayer()
      map.addLayer(tileLayer)
      addLegendControl()
      map.setView([20.78693059257028, -10.865478515625], windowWidth > 768 ? (windowWidth > 1024 ? 6 : 5) : 5)
    }
  }, [map, mapType, t, windowWidth])

  useEffect(() => {
    const getSelectedFeature = (data, id) => data.find(item => item.properties?.id === id)
    const fitBoundsToFeature = feature => {
      if (map && feature) {
        const { geo_title: title, zone_name: zoneName, geozone_pop: population } = feature.properties

        if (!feature.geometry || !feature.geometry.coordinates || !feature.geometry.coordinates.length) {
          return
        }
        const Layer = L.geoJSON(feature)

        // if bounds are valid
        if (Layer.getBounds().isValid()) {
          map.eachLayer(layer => {
            if (layer instanceof L.Popup) {
              map.removeLayer(layer)
            }
          })

          map.eachLayer(layer => {
            if (layer instanceof L.GeoJSON) {
              map.removeLayer(layer)
            }
          })

          Layer.addTo(map)
          map.fitBounds(Layer.getBounds())
          L.geoJSON(feature, {
            style: {
              color: 'green',
              weight: '6',
              fillOpacity: 0
            }
          }).addTo(map)

          const popup = L.popup().setContent(
            `<div style="font-size: 14px; maxHeight:77px; ${textStyleDir}"><strong>${t(title)}</strong><br/>${t(
              'zone'
            )}: <span style="color: green">${t(zoneName)}</span><br/>${t(
              'Population Count'
            )}: <span style="color: green; font-style: italic;">${t(population)}</span></div>`
          )
          popup.setLatLng(Layer.getBounds().getCenter())
          setSelectedZoneData(feature.properties)
        }
      }
    }
    if (!wilaya && !moughataa && !zoneSanitaire && !entity) {
      setSelectedZoneData(null)
      if (document.getElementById('zoneCouverte')) document.getElementById('zoneCouverte').style.display = 'block'

      if (map) reinitializeMap()
    }

    if (wilaya && !moughataa && !zoneSanitaire && !entity) {
      const selectedWilaya = getSelectedFeature(GeoDataOld.willaya.features, wilaya)
      document.getElementById('zoneCouverte').style.display = 'none'
      fitBoundsToFeature(selectedWilaya)

      if (!selectedWilaya) return
      setSelectedZoneData({
        title: allWilaya?.find(item => item.id === wilaya)?.name,
        data: [
          {
            title: t('population'),
            value: selectedWilaya.properties.geozone_pop
          },
          {
            // moughataas
            title: t('Moughataas'),
            value: allMoughataa?.length
          },
          {
            title: t('structre_sanitaire'),
            value: selectedWilaya.properties.PS + selectedWilaya.properties.CS + selectedWilaya.properties.hospitals
          },
          {
            title: t('Hospitals'),
            value: selectedWilaya.properties.hospitals
          },
          {
            title: t('centre_sante'),
            value: selectedWilaya.properties.CS
          },
          {
            title: t('poste_sante'),
            value: selectedWilaya.properties.PS
          }
        ]
      })
      showDistrictsHandler()
    } else if (moughataa && !zoneSanitaire && !entity) {
      const selectedMoughataa = getSelectedFeature(GeoDataOld.moughataa.features, moughataa)
      if (!selectedMoughataa) return

      fitBoundsToFeature(selectedMoughataa)
      setSelectedZoneData({
        title: allMoughataa?.find(item => item.id === moughataa)?.name,
        data: [
          {
            title: t('population'),
            value: selectedMoughataa.properties.geozone_pop
          },
          {
            title: t('Hospitals'),
            value: selectedMoughataa.properties.hospitals
          },
          {
            title: t('centre_sante'),
            value: selectedMoughataa.properties.CS
          },
          {
            title: t('poste_sante'),
            value: selectedMoughataa.properties.PS
          }
        ]
      })
      showHealthAreasHandler()
    } else if (zoneSanitaire && !entity) {
      const selectedZoneSanitaire = getSelectedFeature(GeoDataOld.aire_sante.features, zoneSanitaire)
      if (!selectedZoneSanitaire) return
      fitBoundsToFeature(selectedZoneSanitaire)
      setSelectedZoneData({
        title: allZoneSanitaire?.find(item => item.id === zoneSanitaire)?.name,
        data: [
          {
            title: t('population'),
            value: selectedZoneSanitaire.properties.geozone_pop
          },
          {
            title: t('centre_sante'),
            value: selectedZoneSanitaire.properties.CS
          },
          {
            title: t('poste_sante'),
            value: selectedZoneSanitaire.properties.PS
          }
        ]
      })
      showEntitiesHandler()
    } else if (entity) {
      const selectedEntity = GeoDataOld.entity?.features?.find(item => item.properties.id === parseInt(entity))

      if (!selectedEntity) return

      map.flyTo([selectedEntity.geometry.coordinates[0], selectedEntity.geometry.coordinates[1]], 16)
      // const popup = L.popup().setContent(`<b>${selectedEntity.properties.entity_name}</b>`)
      // map.addLayer(popup)

      setSelectedZoneData({
        title: allEntities?.find(item => item.id === entity)?.name,
        image: selectedEntity.properties.picture_path
          ? `${process.env.NEXT_PUBLIC_API_URP}/${selectedEntity.properties.picture_path}`
          : '/images/notfound.svg'
      })
    }
  }, [
    wilaya,
    moughataa,
    zoneSanitaire,
    entity,
    allWilaya,
    allMoughataa,
    allZoneSanitaire,
    allEntities,
    map,
    t,
    locale,
    GeoDataOld,
    textStyleDir
  ])

  const reinitializeMap = () => {
    // remove all layers from the map
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })
    map.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) {
        map.removeLayer(layer)
      }
    })
    // map.setZoom(7)
    map.setView([20.78693059257028, -10.865478515625], windowWidth > 768 ? (windowWidth > 1024 ? 6 : 5) : 5)

    showWilayaHandler()
    if (mapType === 1) {
      L.geoJSON(geoJSON, {
        style: function (feature) {
          return {
            color: 'green',
            weight: 4,
            fillColor: 'green',
            fillOpacity: 0
          }
        }
      }).addTo(map)
    }
  }

  const showWilayaHandler = () => {
    const wilayaLayer = L.geoJSON(GeoDataOld.willaya.features)
    wilayaLayer?.addTo(map).setStyle({ fillColor: 'green', color: 'green' })
    hideEntitiesHandler()
  }
  const showDistrictsHandler = () => {
    const moughataaLayer = L.geoJSON(
      GeoDataOld.moughataa?.features?.filter(item => item.properties.parent_id === parseInt(wilaya)) as any
    )
    moughataaLayer?.addTo(map).setStyle({ weight: 2 })
    hideEntitiesHandler()
  }

  const showHealthAreasHandler = () => {
    const aireSanteLayer = L.geoJSON(
      GeoDataOld.aire_sante?.features?.filter(item => item.properties.parent_id === parseInt(moughataa)) as any
    )
    aireSanteLayer?.addTo(map).setStyle({ fillColor: 'yellow', color: 'yellow' })

    showEntitiesHandler()
  }

  const showEntitiesHandler = () => {
    hideEntitiesHandler()
    let entities
    if (!zoneSanitaire) {
      const zones = GeoDataOld.aire_sante?.features?.filter(item => item.properties.parent_id === parseInt(moughataa))
      entities = GeoDataOld.entity?.features?.filter(item =>
        zones?.map(zone => zone.properties.id).includes(item.properties.zone_id)
      )
    } else {
      entities = GeoDataOld.entity?.features?.filter(item => item.properties.zone_id === parseInt(zoneSanitaire))
    }
    entities?.forEach(ent => {
      const markerIcon = L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="marker-wrapper"><img src="${process.env.NEXT_PUBLIC_API_URP}/${ent.properties.entitytype_icon}" class="marker-icon" /></div>`,
        iconSize: [25, 41], // Adjust according to your icon size
        iconAnchor: [12, 41] // Adjust according to your icon size,
      })
      // on click zoom on it and selec

      const marker = L.marker([ent.geometry.coordinates[0], ent.geometry.coordinates[1]], {
        icon: markerIcon
      })
      marker.addTo(map)
      marker.on('click', () => {
        map.setView(marker.getLatLng(), 11)
      })
      marker.bindPopup(
        `<b id="popup-${ent.properties.id}" class='cursor-pointer underline'>${ent.properties.entity_name}</b>`
      )

      marker.on('popupopen', () => {
        const popupElement = document.getElementById(`popup-${ent.properties.id}`)
        popupElement.addEventListener('click', () => {
          setZoneSanitaire(ent.properties.zone_id)
          setEntity(ent.properties.id) // Assuming setEntity is a function that handles setting the clicked entity
        })
      })
    })
  }

  const hideEntitiesHandler = () => {
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })
  }

  const RenderFilterForm = () => {
    // if is loading render a skeleton

    // if (isLoadingWilayaa) {
    //   return (
    //     <div className='flex flex-wrap flex-col gap-10 flex-grow'>
    //       <Skeleton variant='rectangular' height={52} className='rounded-sm' />
    //       <Skeleton variant='rectangular' height={52} className='rounded-sm' />
    //       <Skeleton variant='rectangular' height={52} className='rounded-sm' />
    //       <Skeleton variant='rectangular' height={52} className='rounded-sm' />
    //     </div>
    //   )
    // }

    return (
      <div className='flex flex-wrap flex-col gap-10 flex-grow'>
        <FormControl fullWidth>
          <InputLabel id='wilayaa-select'>{t('Wilayaa')}</InputLabel>
          <Select
            fullWidth
            value={wilaya}
            id='select-wilayaa'
            label='Select Wilayaa'
            labelId='wilayaa-select'
            size='medium'
            variant='standard'
            onChange={e => {
              setWilaya(e.target.value)
              setMoughataa(null)
              setZoneSanitaire(null)
              setEntity(null)
            }}
            inputProps={{ placeholder: 'Select Wilayaa' }}
          >
            <MenuItem value={null}>{t('Sélectionner')}</MenuItem>
            {allWilaya?.map(wilaya => (
              <MenuItem key={wilaya.id} value={wilaya.id}>
                {t(wilaya.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(windowWidth > 768 || wilaya) && (
          <FormControl fullWidth>
            <InputLabel id='moughataa-select'>{t('Moughataa')}</InputLabel>
            <Select
              fullWidth
              value={moughataa}
              id='select-moughataa'
              label='Select Moughataa'
              labelId='moughataa-select'
              onChange={e => {
                setMoughataa(e.target.value)
                setZoneSanitaire(null)
                setEntity(null)
              }}
              variant='standard'
              inputProps={{ placeholder: 'Select Moughataa' }}
            >
              <MenuItem value={null}>{t('Sélectionner')}</MenuItem>
              {allMoughataa?.map(moughataa => (
                <MenuItem key={moughataa.id} value={moughataa.id}>
                  {t(moughataa.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {(windowWidth > 768 || moughataa) && (
          <FormControl fullWidth>
            <InputLabel id='zone-select'>{t('Aires sanitaires')}</InputLabel>
            <Select
              fullWidth
              value={zoneSanitaire}
              id='select-zone'
              label='Select Zone'
              labelId='zone-select'
              onChange={e => {
                setZoneSanitaire(e.target.value)
                setEntity(null)
              }}
              variant='standard'
              inputProps={{ placeholder: 'Select Zone' }}
            >
              <MenuItem value={null}>{t('Sélectionner')}</MenuItem>
              {allZoneSanitaire?.map(zoneSanitaire => (
                <MenuItem key={zoneSanitaire.id} value={zoneSanitaire.id}>
                  {t(zoneSanitaire.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(windowWidth > 768 || zoneSanitaire) && (
          <FormControl fullWidth>
            <InputLabel id='role-select'>{t('Formations Sanitaires')}</InputLabel>
            <Select
              fullWidth
              value={entity}
              id='select-entity'
              label='Select Entity'
              labelId='entity-select'
              onChange={e => setEntity(e.target.value)}
              inputProps={{ placeholder: 'Select Entity' }}
              variant='standard'
            >
              <MenuItem value={null}>{t('Sélectionner')}</MenuItem>
              {allEntities?.map(entity => (
                <MenuItem key={entity.id} value={entity.id}>
                  {t(entity.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* block code legende */}
        {moughataa && (
          <div className=' justify-around flex text-center items-center border-gray-500 border rounded-md '>
            <div className='flex flex-row  gap-8 p-2 '>
              <div className='flex-row gap-2 items-center'>
                <Image src='/icon/home ps img.svg' alt='icon' height={20} width={20} />{' '}
                <h6 className='font-bold '> </h6>
                {t('poste de santé')}
              </div>
              <div className='flex-row gap-2 items-center'>
                {' '}
                <Image src='/icon/Cs img.svg' alt='icon' height={20} width={20} />
                {t('centre de santé')}
              </div>
              <div className='flex-row gap-2 items-center'>
                {' '}
                <Image src='/icon/icons_hospital.svg' alt='icon' height={20} width={20} /> {t('hospital')}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4 items-start justify-between pt-2'>
      {' '}
      <RenderFilterForm />
      <div
        className='col-span-2 '
        style={{
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <div className='flex justify-center items-center h-full w-full'>
          <MapContainer
            className='map-- '
            whenCreated={setMap}
            scrollWheelZoom={false}
            dragging={false}
            tap={false}
          ></MapContainer>
        </div>
      </div>
      {selectedZoneData && selectedZoneData.image ? (
        <div className='flex flex-col gap-4 flex-grow  '>
          <Typography variant='h5' className='border-red-600 border-b-2'>
            {t(selectedZoneData.title)}
          </Typography>
          <img src={selectedZoneData.image} className=' w-96' />
        </div>
      ) : (
        selectedZoneData && (
          <div className='flex flex-col gap-4 flex-grow '>
            <Typography variant='h5' className='border-red-600 border-b-2'>
              {t(selectedZoneData.title)}
            </Typography>
            {selectedZoneData.data?.map((item, index) => {
              if (item.value == 0 || item.value === null) return null

              return (
                <Box
                  key={index}
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { fontSize: '0.75rem', color: 'primary.main' },
                    gap: 3,
                    width: '100%'
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography sx={{ fontWeight: 600 }}>{t(item.title)}</Typography>
                  <Typography
                    sx={{
                      marginLeft: 'auto'
                    }}
                  >
                    {t(item.value)}
                  </Typography>
                </Box>
              )
            })}
          </div>
        )
      )}
      {selectedZoneData === null && (
        <div className='flex flex-col gap-4 flex-grow '>
          <Typography variant='h5' className='border-red-600 border-b-2'>
            {t(DataTotal.title)}
          </Typography>
          {DataTotal.data.map((item, index) => {
            if (item.value === 0 || item.value === null) return null

            if (item.title) {
              return (
                <Box
                  key={index}
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { fontSize: '0.75rem', color: 'primary.main' },
                    gap: 3,
                    width: '100%'
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography sx={{ fontWeight: 600 }}>{t(item.title)}</Typography>
                  <Typography
                    sx={{
                      marginLeft: 'auto'
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              )
            } else if (item.subtitle) {
              return (
                <Box
                  key={index}
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '50px',
                    '& svg': { fontSize: '0.6rem', color: 'primary.main' },
                    gap: 3
                    // width: '100%'
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography sx={{ fontWeight: 600 }}>{t(item.subtitle)}</Typography>
                  <Typography
                    sx={{
                      marginLeft: 'auto'
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}
