import { INode, INodes } from '../../interfaces/main';
import api from '../api';

export const getNodes = async (): Promise<INodes> => {
  const res = await api.get('/nodes');
  const pass = Object.assign({}, ...res.data.map((e: INode) => ({ [e.id]: e })));
  return pass;
};
