import { Feature, FeatureCollection, Geometry } from 'geojson';
import mapboxgl, { GeoJSONSource, LngLatLike, Map } from 'mapbox-gl';
import React, { useEffect } from 'react';
import { MAPGL_API } from '../../constants/api';
import { IJob, INode } from '../../interfaces/main';

mapboxgl.accessToken = MAPGL_API;

interface MapProp {
  jobs: IJob[];
  nodes: INode[];
}
const TrackerMap: React.FC<MapProp> = ({ jobs, nodes }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [lng, setLng] = React.useState(100.523186);
  const [lat, setLat] = React.useState(13.736717);
  const [zoom, setZoom] = React.useState(9);

  const [map, setMap] = React.useState<Map>();

  // const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (mapContainer.current !== null) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      });
      map.on('load', () => {
        map.addSource('nodes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
          cluster: true,
          clusterMaxZoom: 12,
          clusterRadius: 20,
        });
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'nodes',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 5, '#f1f075', 10, '#f28cb1'],
            'circle-radius': ['step', ['get', 'point_count'], 15, 2, 15, 5, 25],
          },
        });
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'nodes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 16,
          },
        });
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'nodes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
          },
        });

        setMap(map);
      });
    }

    return () => map?.remove();
  }, []);

  useEffect(() => {
    if (map?.getSource('nodes')) {
      const stores: FeatureCollection = {
        type: 'FeatureCollection',
        features: nodes.map((e) => {
          const point: Feature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lng, e.lat],
            },
            properties: {
              id: e.id,
              name: e.name,
            },
          };
          return point;
        }),
      };
      (map.getSource('nodes') as GeoJSONSource)?.setData(stores);
    }
  }, [nodes, map]);

  const goTo = (center: LngLatLike) => {
    map?.flyTo({
      center: center,
      zoom: 15,
    });
  };

  return <div ref={mapContainer} style={{ height: '80vh' }}></div>;
};

export default TrackerMap;
