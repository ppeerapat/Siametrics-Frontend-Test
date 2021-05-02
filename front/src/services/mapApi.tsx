import axios from 'axios';
const mapApi = axios.create({
  baseURL: 'https://api.mapbox.com',
});

export default mapApi;
