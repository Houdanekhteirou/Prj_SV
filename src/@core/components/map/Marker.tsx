import { divIcon } from 'leaflet'
import { ReactElement, Ref, useEffect, useRef } from 'react'

// import { renderToString } from 'react-dom/server'
import { LatLngLiteral } from 'leaflet'
import { Marker, Popup, useMap } from 'react-leaflet'

export const createLeafletIcon = (
  icon: ReactElement,
  size: number,
  className?: string,
  width: number = size,
  height: number = size,
  center = false
) => {
  const widthAnchor = width / 2
  const heightAnchor = center ? height / 2 : height

  return divIcon({
    html: null,
    iconSize: [width, height],
    iconAnchor: [widthAnchor, heightAnchor],
    popupAnchor: [0, -heightAnchor],
    className: className ? className : ''
  })
}

export interface LeafletMarkerProps {
  position: LatLngLiteral
  flyToPosition?: boolean
  size?: number
  color?: string
  icon?: ReactElement
  defaultOpen?: boolean
  onOpen?: () => void
  children?: React.ReactNode
  markerType?: string
  zIndexOffset?: number
  centerMarker?: boolean
}

const LeafletMarker: React.FC<LeafletMarkerProps> = ({
  position,
  flyToPosition = false,
  children,
  size = 30,
  color,
  defaultOpen = false,
  onOpen,
  icon = null,
  markerType,
  zIndexOffset,
  centerMarker = false
}) => {
  const map = useMap()

  const markerRef = useRef(null)
  position && flyToPosition && map.flyTo(position)

  const markerIcon = createLeafletIcon(icon, size, markerType, size, size, centerMarker) // Important to not get default styling
  useEffect(() => {
    if (defaultOpen) {
      try {
        if (markerRef.current !== null && !markerRef.current.isPopupOpen()) {
          markerRef.current.openPopup()
        }
      } catch (error) {}
    }
  }, [defaultOpen, position.lat, position.lng])

  return (
    <Marker
      eventHandlers={{
        popupopen: () => onOpen && onOpen()
      }}
      ref={markerRef}
      icon={markerIcon}
      position={position}
      zIndexOffset={zIndexOffset}
    >
      {/* autoPan important to not have jittering */}
      {children && <Popup autoPan={false}>{children}</Popup>}
    </Marker>
  )
}

export default LeafletMarker
