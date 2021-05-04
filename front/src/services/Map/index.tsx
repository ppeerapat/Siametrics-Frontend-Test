import mapboxgl, { LngLatLike } from 'mapbox-gl';
import mapApi from '../mapApi';

export const getMatch = async (e: number[][]) => {
  const res = await mapApi.get('/directions/v5/mapbox/driving/' + e.join(';') + '?geometries=geojson&steps=false&access_token=' + mapboxgl.accessToken);
  console.log(res.data);
  return res.data;
};
