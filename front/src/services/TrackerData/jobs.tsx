import api from '../api';

export const getJobs = async () => {
  const res = await api.get('/jobs');
  return res.data;
};

export const getJobsByDriver = async (value: string) => {
  const res = await api.get('/jobs?driver.name_like=' + value);
  return res.data;
};
