import { IJob, IOrder } from '../../interfaces/main';
import api from '../api';

export const getJobs = async () => {
  const res = await api.get('/jobs');
  return transformData(res.data);
};

export const getJobsByDriver = async (value: string) => {
  const res = await api.get('/jobs?driver.name_like=' + value);
  return transformData(res.data);
};

const transformData = (req: IJob[]) => {
  const res = req.map((j) => {
    const orders = j.orders.map((o, i) => {
      o.id = i.toString();
      return o;
    });
    j.orders = orders;
    return j;
  });
  return res;
};
