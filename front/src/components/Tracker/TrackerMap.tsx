import { Feature, FeatureCollection, LineString } from 'geojson';
import mapboxgl, { GeoJSONSource, LngLatLike, Map, Popup } from 'mapbox-gl';
import React, { useEffect } from 'react';
import { MAPGL_API } from '../../constants/api';
import { IJob, INodes, IOrder, TargetOrder } from '../../interfaces/main';
import { getMatch } from '../../services/Map';

mapboxgl.accessToken = MAPGL_API;

interface MapProp {
  jobs: IJob[];
  nodes: INodes;
  selectedOrder?: TargetOrder;
}

interface MarkerProp extends IOrder {
  message?: string;
  driver: string;
  date: string;
  lat: number;
  nodeName: string;
  lng: number;
}
// const CustomMarker:React.FC = ({order}) =>{
//   return()
// }

const TrackerMap: React.FC<MapProp> = ({ jobs, nodes, selectedOrder }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [lng, setLng] = React.useState(100.523186);
  const [lat, setLat] = React.useState(13.736717);
  const [zoom, setZoom] = React.useState(9);
  const [popUp, setPopUp] = React.useState<Popup[]>();
  const [map, setMap] = React.useState<Map>();
  // const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (mapContainer.current !== null) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 15,
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
          id: 'nodes-layer',
          type: 'circle',
          source: 'nodes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
          },
        });
        map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['nodes-layer'],
          });

          if (features.length) {
            const clickedPoint = features[0].geometry;
            if (clickedPoint.type === 'Point') {
              goTo([clickedPoint.coordinates[0], clickedPoint.coordinates[1]]);
            }
          }
        });
        setMap(map);
      });
    }

    return () => {
      map?.remove();
      popUp?.forEach((p) => {
        p.remove();
      });
      setPopUp([]);
    };
  }, []);

  useEffect(() => {
    if (map?.getSource('nodes')) {
      const stores: FeatureCollection = {
        type: 'FeatureCollection',
        features: Object.values(nodes).map((e) => {
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

  useEffect(() => {
    removeRoute();
    popUp?.forEach((p) => {
      p.remove();
    });
    setPopUp([]);
    if (selectedOrder) {
      goTo([selectedOrder.lng, selectedOrder.lat]);

      const job = jobs.find((j) => j.id == selectedOrder.jobId);
      if (job) {
        // addRoute(job.route);
        const index = parseInt(selectedOrder.id);
        const endAt = job.orders.length - 1;
        if (parseInt(selectedOrder.id) < endAt) {
          const toOrder = job.orders[index + 1];
          const toNode = nodes[toOrder.node];
          const popupToOrder = {
            driver: job.driver.name,
            nodeName: toNode.name,
            ...toNode,
            ...toOrder,
            date: job.date,
            message: 'To',
          };
          createNodePopUp([{ message: 'From', ...selectedOrder }, popupToOrder]);
          const waypoints = job.orders.slice(index, index + 2).map((o) => {
            const node = nodes[o.node];
            return [node.lng, node.lat];
          });
          getMatch(waypoints).then((res) => {
            addRoute(res.routes[0].geometry);
          });
        } else {
          createNodePopUp([{ message: 'Ending', ...selectedOrder }]);
        }

        // console.log(selectedOrder.id, waypoints);
      }
    }
  }, [selectedOrder]);

  const removeRoute = () => {
    if (map?.getSource('route')) {
      map?.removeLayer('route');
      map?.removeSource('route');
    }
  };
  const addRoute = (route: LineString) => {
    if (map) {
      // Add a new layer to the map
      // removeRoute();
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route,
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#03AA46',
          'line-width': 8,
          'line-opacity': 0.6,
        },
      });
    }
  };
  const goTo = (center: LngLatLike) => {
    map?.flyTo({
      center: center,
      zoom: 15,
    });
  };
  const createNodePopUp = (orders: MarkerProp[]) => {
    const popups = orders.map((o) => {
      const customPopUp = `<div><p>Node: ${o.nodeName}</p><p>${o.date} ${o.time}</p><p>Driver: ${o.driver}</p><p>No. of Items: ${o.numberOfItem}</p><p>${
        o.message ?? ''
      }</p></div>`;
      return new mapboxgl.Popup({ closeOnClick: false, closeButton: false }).setLngLat([o.lng, o.lat]).setHTML(customPopUp);
    });
    setPopUp(popups);
  };

  React.useEffect(() => {
    if (map && popUp?.length != 0) {
      popUp?.forEach((p) => p.addTo(map));
    }
  }, [popUp]);

  return <div ref={mapContainer} style={{ height: '80vh' }}></div>;
};
export default TrackerMap;
