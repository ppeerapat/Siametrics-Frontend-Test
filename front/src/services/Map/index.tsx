import mapboxgl, { LngLatLike } from 'mapbox-gl';
import mapApi from '../mapApi';

export const getMatch = async (e: LngLatLike[]) => {
  const res = await mapApi.get('/directions/v5/mapbox/driving/' + e.join(';') + '?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken);
  return res.data;
};
