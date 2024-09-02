import L from 'leaflet'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

// import GeoDataOld from './geo.json'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Feature, Geometry } from 'geojson'
import { Icon } from 'leaflet'
import 'leaflet-boundary-canvas'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-scroll'
import { formatNumberWithDots } from 'src/@core/utils'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import axiosInstance from 'src/api/axiosInstance'
import getGeoJson from './a'

const customIcon = (entitytype_icon, iconSize) => {
  return new Icon({
    iconUrl: `${process.env.NEXT_PUBLIC_API_URP}/${entitytype_icon}`,
    iconSize: iconSize
  })
}

const COLOR = '#00a651bd'

const mapStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

const MapComponent = () => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const pageHeight = useRef(0)
  const GeoDataOld = getGeoJson()

  const [isMounted, setIsMounted] = React.useState(false)
  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const [entity, setEntity] = useState<string | null>(null)
  const [selectedZoneData, setSelectedZoneData] = useState<any>(null)

  const { data: allWilaya, isLoading: isLoadingWilayaa } = useQuery({
    queryKey: ['wilaya'],
    queryFn: async () => {
      const res = await fetchZonesByLevel(2)

      return res
    }
  })

  const { data: allMoughataa, isLoading: isLoadingMoughataa } = useQuery({
    queryKey: ['moughataa', wilaya],
    queryFn: async () => {
      const res = await fetchZonesByLevel(4, wilaya)

      return res
    },
    enabled: !!wilaya
  })

  const { data: allZoneSanitaire, isLoading: isLoadingZoneSanitaire } = useQuery({
    queryKey: ['zoneSanitaire', moughataa],
    queryFn: async () => {
      const res = await fetchZonesByLevel(5, moughataa)

      return res
    },
    enabled: !!moughataa
  })

  const { data: allEntities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: async () => {
      const res = await fetchEntitiesByZoneId({
        zoneId: zoneSanitaire
      })

      return res
    },
    enabled: !!zoneSanitaire
  })

  // on wilaaya or moughataa or zone or entity change focus on the selected zone
  useEffect(() => {
    const getSelectedFeature = (data, name) => data.find(item => item.properties.zone_name === name)

    const fitBoundsToFeature = feature => {
      if (feature) {
        if (!feature.geometry || !feature.geometry.coordinates || !feature.geometry.coordinates.length) {
          return
        }
        const Layer = L.geoJSON(feature)

        // show only the selected feature
        // set style random color
        Layer.setStyle({
          color: COLOR,
          weight: 100
        })
        Layer.addTo(mapRef.current)
        mapRef.current.fitBounds(Layer.getBounds())

        const popup = L.popup().setContent(`<b>${feature.properties.zone_name}</b>`)
        popup.setLatLng(Layer.getBounds().getCenter())
        mapRef.current.addLayer(popup)

        // show the popup
        Layer.openPopup()

        setSelectedZoneData(feature.properties)
      }
    }

    if (wilaya && !moughataa && !zoneSanitaire && !entity) {
      const wilayaName = allWilaya.find(w => w.id === wilaya)?.name
      const selectedWilaya = getSelectedFeature(GeoDataOld.willaya.features, wilayaName)
      fitBoundsToFeature(selectedWilaya)
    } else if (moughataa && !zoneSanitaire && !entity) {
      const moughataaName = allMoughataa.find(m => m.id === moughataa)?.name

      const selectedMoughataa = getSelectedFeature(GeoDataOld.moughataa.features, moughataaName)
      fitBoundsToFeature(selectedMoughataa)
    } else if (zoneSanitaire && !entity) {
      const zoneSanitaireName = allZoneSanitaire.find(z => z.id === zoneSanitaire)?.name
      const selectedZoneSanitaire = getSelectedFeature(GeoDataOld.aire_sante.features, zoneSanitaireName)
      fitBoundsToFeature(selectedZoneSanitaire)
    } else if (entity) {
      const entityName = allEntities.find(e => e.id === entity)?.name
      const selectedEntity = GeoDataOld.entity.features.find(e => e.properties.entity_name === entityName)

      mapRef.current.flyTo([selectedEntity.geometry.coordinates[1], selectedEntity.geometry.coordinates[0]], 10)

      const popup = L.popup().setContent(`<b>${selectedEntity.properties.entity_name}</b>`)
      popup.setLatLng([selectedEntity.geometry.coordinates[1], selectedEntity.geometry.coordinates[0]])
      mapRef.current.addLayer(popup)

      // Open the popup
      popup.openOn(mapRef.current)
    }
  }, [wilaya, moughataa, zoneSanitaire, entity, allWilaya, allMoughataa, allZoneSanitaire, allEntities])

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const [iconSize, setIconSize] = useState([15, 15])

  const mapRef = useRef<L.Map>()
  const [showDistricts, setShowDistricts] = useState(false)
  const [showHealthAreas, setShowHealthAreas] = useState(false)
  const [showEntities, setShowEntities] = useState(false)

  const { data: GeoData, isLoading } = useQuery({
    queryKey: ['geodata'],
    queryFn: async () => {
      const res = await axiosInstance.get(process.env.NEXT_PUBLIC_API_URP + '/api/public/pbf-geo-zones')

      return res.data
    }
  })

  const wilayaStyle = useMemo(() => {
    return {
      color: 'green',
      weight: 2
    }
  }, [])

  const moughataaStyle = useMemo(() => {
    return {
      color: 'indigo',
      weight: 1,
      fillColor: 'green'
    }
  }, [])

  useEffect(() => {
    pageHeight.current = window.innerHeight
  }, [])

  useEffect(() => {
    const handleEscapeKey = event => {
      if (event.key === 'Escape') {
        mapRef.current?.setZoom(6)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  const MapEvents = () => {
    const map = useMap()

    useEffect(() => {
      const handleZoom = () => {
        const currentZoom = map.getZoom()

        switch (true) {
          case currentZoom >= 9:
            setShowEntities(true)
            setIconSize([13, 13])
            break
          case currentZoom >= 8:
            setShowHealthAreas(true)
            setIconSize([15, 15])
            break
          case currentZoom >= 7:
            setShowDistricts(true)
            setIconSize([17, 17])
            break
          default:
            setShowEntities(false)
            setShowHealthAreas(false)
            setShowDistricts(false)
            setIconSize([13, 13])
            break
        }
      }

      map.on('zoomend', handleZoom)

      return () => {
        map.off('zoomend', handleZoom)
      }
    }, [map])

    return null
  }

  const textStyleDir = useMemo(() => (locale === 'ar' ? 'text-align:right;' : ''), [])

  const onEachFeatureWilaya = useCallback((ft: Feature<Geometry, any>, layer: L.Layer) => {
    const { geo_title: title, zone_name: zoneName, geozone_pop: population } = ft.properties

    layer.on({
      mouseover: e => {
        const formattedPop = formatNumberWithDots(population)
        layer
          .bindPopup(
            `<div style="font-size: 14px; maxHeight:77px; ${textStyleDir}"><strong>${t(title)}</strong><br/>${t(
              'zone'
            )}: <span style="color: green">${zoneName}</span><br/>${t(
              'Population Count'
            )}: <span style="color: green; font-style: italic;">${formattedPop}</span></div>`
          )
          .openPopup()
      },
      mouseout: e => {
        layer.unbindPopup()
      }
    })
    layer.title = title

    layer.setStyle({
      // color: Color,
      weight: 1

      // fillColor: color
    })
  }, [])

  const onEachFeatureOthers = useCallback((ft: Feature<Geometry, any>, layer: L.Layer) => {
    const { geo_title: title, zone_name: zoneName, geozone_pop: population } = ft.properties

    layer.on({
      mouseover: e => {
        const formattedPop = formatNumberWithDots(population)
        layer
          .bindPopup(
            `<div style="font-size: 14px; maxHeight:77px; ${textStyleDir}"><strong>${t(title)}</strong><br/>${t(
              'zone'
            )}: <span style="color: green">${zoneName}</span><br/>${t(
              'Population Count'
            )}: <span style="color: green; font-style: italic;">${formattedPop}</span></div>`
          )
          .openPopup()
      },
      mouseout: e => {
        layer.unbindPopup()
      }
    })

    const color = COLOR
    layer.setStyle({
      // color: color,
      weight: 1

      // fillColor: color
    })
  }, [])

  const EntityMarkers = () => {
    return GeoDataOld.entity.features.map((entity, index) => {
      return (
        <Marker
          key={index}
          position={[entity.geometry.coordinates[0], entity.geometry.coordinates[1]]}
          icon={customIcon(entity.properties.entitytype_icon, iconSize)}

          // use the custom icon here
        >
          <Popup>
            <div style={{ fontSize: '14px' }}>
              <strong>{entity.properties.entity_name}</strong>
              <br />
              <span style={{ fontSize: '12px' }}>{t('Population Count')}&nbsp;&nbsp;</span>
            </div>
          </Popup>
        </Marker>
      )
    })

    // }

    return <></>
  }

  // if (isLoading) return <Loading />;

  return (
    isMounted && (
      <div className='w-screen flex mt-16 gap-4 sm:flex-row flex-col '>
        <div className='m-4 flex flex-col gap-4 '>
          <div className=' min-w-64 '>
            <FormControl fullWidth>
              <InputLabel id='wilayaa-select'>{t('Wilaya')}</InputLabel>
              <Select
                fullWidth
                value={wilaya}
                id='select-wilayaa'
                label='Select Wilayaa'
                labelId='wilayaa-select'
                onChange={e => {
                  setWilaya(e.target.value)
                  setMoughataa(null)
                  setZoneSanitaire(null)
                  setEntity(null)
                }}
                inputProps={{ placeholder: 'Select Wilayaa' }}
              >
                {allWilaya?.map(wilaya => (
                  <MenuItem key={wilaya.value} value={wilaya.id}>
                    {wilaya.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
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
                inputProps={{ placeholder: 'Select Moughataa' }}
              >
                {allMoughataa?.map(moughataa => (
                  <MenuItem key={moughataa.id} value={moughataa.id}>
                    {moughataa.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id='zone-select'>{t('Zone Sanitaire')}</InputLabel>
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
                inputProps={{ placeholder: 'Select Zone' }}
              >
                {allZoneSanitaire?.map(zoneSanitaire => (
                  <MenuItem key={zoneSanitaire.id} value={zoneSanitaire.id}>
                    {zoneSanitaire.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id='role-select'>{t('Entity')}</InputLabel>
              <Select
                fullWidth
                value={entity}
                id='select-entity'
                label='Select Entity'
                labelId='entity-select'
                onChange={e => setEntity(e.target.value)}
                inputProps={{ placeholder: 'Select Entity' }}
              >
                {allEntities?.map(entity => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            {selectedZoneData && (
              <div>
                <Typography variant='body1'>
                  {t('Name')}: {selectedZoneData.zone_name}
                </Typography>
                <Typography variant='body1'>
                  {t('Zone')}: {selectedZoneData.geo_title}
                </Typography>
                <Typography variant='body1'>
                  {t('Population Count')}: {formatNumberWithDots(selectedZoneData.geozone_pop)}
                </Typography>
                <Typography variant='body1'>
                  {t('geozone_pop_year')}: {selectedZoneData.geozone_pop_year}
                </Typography>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            height: '50vh',
            width: '100%',
            overflow: 'hidden',
            zIndex: 0
          }}
        >
          <Link
            to='home'
            smooth
            className='outline-none border-none bg-primary-600 p-2 shadow-sm rounded-lg hover:shadow-md absolute bottom-4 ltr:right-4 rtl:left z-50 animate-bounce cursor-pointer'
          >
            {/* <BsArrowDown className='text-white h-6 w-6' /> */}
          </Link>

          <MapContainer
            ref={mapRef}
            center={[18.83844036150895, -10.242092381240377]}
            zoom={6}
            scrollWheelZoom={false}
            style={mapStyle}

            // style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url='https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}'
              attribution=''
              id='mapbox.streets'
              accessToken='pk.eyJ1IjoiaGFmZWRtaWgiLCJhIjoiY2wzZjVtbmZmMDVvOTNrbnhmMmgxZHF1MiJ9.l1lFW_2Ngqj7Y6tKpia6Lg'
            />
            <MapEvents />

            <GeoJSON data={GeoDataOld.willaya} style={wilayaStyle} onEachFeature={onEachFeatureWilaya} />
            {showDistricts && (
              <GeoJSON
                data={GeoDataOld.moughataa}
                style={{
                  color: 'yellow',
                  weight: 1,
                  fillColor: 'green'
                }}
                onEachFeature={onEachFeatureOthers}
              />
            )}
            {showHealthAreas && (
              <GeoJSON data={GeoDataOld.aire_sante} style={moughataaStyle} onEachFeature={onEachFeatureOthers} />
            )}
            <EntityMarkers />
          </MapContainer>
        </div>
      </div>
    )
  )
}

export default MapComponent
