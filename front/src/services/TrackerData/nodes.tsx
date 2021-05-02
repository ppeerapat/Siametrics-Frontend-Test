import api from '../api';

export const getNodes = async () => {
  const res = await api.get('/nodes');
  return res.data;
};
