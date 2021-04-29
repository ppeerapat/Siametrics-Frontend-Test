import mapboxgl from 'mapbox-gl';
import React from 'react';
import { MAPGL_API } from '../../constants/api';

mapboxgl.accessToken = MAPGL_API;

const Map: React.FC = () => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [lng, setLng] = React.useState(-70.9);
  const [lat, setLat] = React.useState(42.35);
  const [zoom, setZoom] = React.useState(9);

  React.useEffect(() => {
    if (mapContainer.current !== null) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      });
      return () => map.remove();
    }
  }, []);
  return <div ref={mapContainer} style={{ height: '100%' }}></div>;
};

export default Map;
