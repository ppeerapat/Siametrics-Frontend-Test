import { LineString } from 'geojson';
import { LngLatLike } from 'mapbox-gl';

export interface IJob extends IObject {
  driver: IDriver;
  date: string;
  orders: IOrder[];
  route?: LineString;
}

export interface IOrder extends IObject {
  date?: string;
  time: string;
  node: string;
  numberOfItem: number;
}

export interface TargetOrder extends IOrder {
  driver: string;
  jobId: string;
  date: string;
  nodeName: string;
  lng: number;
  lat: number;
  end?: boolean;
}
export interface INode extends IObject {
  name: string;
  lng: number;
  lat: number;
}

export interface INodes {
  [id: string]: INode;
}

export interface IDriver extends IObject {
  name: string;
}

interface IObject {
  id: string;
}
