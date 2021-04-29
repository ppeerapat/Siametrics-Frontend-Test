import { Card, Layout } from 'antd';
import React from 'react';
import { IDriver } from '../../interfaces/main';
import Map from './Map';
const { Content, Sider } = Layout;

const driver: IDriver = { id: '1', name: 'testasdasdassdaestasdasdassdaestasdasdassdaestasdasdassdaestasdasdassda' };
interface DriverCardProp {
  driver: IDriver;
}
const DriverCard: React.FC<DriverCardProp> = ({ driver }) => {
  return <Card>{driver.name}</Card>;
};
const TrackerWindow: React.FC = () => {
  return (
    <Layout className="layout" style={{ width: '90vw', margin: 'auto' }}>
      <Sider width="260px" theme="light">
        <div>
          <DriverCard driver={driver} />
          <DriverCard driver={driver} />
          <DriverCard driver={driver} />
          <DriverCard driver={driver} />
        </div>
      </Sider>
      <Content style={{ height: '80vh' }}>
        <Map />
      </Content>
    </Layout>
  );
};

export default TrackerWindow;
