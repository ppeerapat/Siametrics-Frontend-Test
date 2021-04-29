export interface IJob extends IObject {
  driver: IDriver;
  date: Date;
  orders: IOrder[];
}

export interface IOrder extends IObject {
  time: string;
  node: string;
  numberOfItem: number;
}

export interface INode extends IObject {
  name: string;
  lat: number;
  lng: number;
}

export interface IDriver extends IObject {
  name: string;
}

interface IObject {
  id: string;
}
