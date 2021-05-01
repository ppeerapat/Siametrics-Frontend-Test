import React from 'react';
import DefaultLayout from '../components/common/DefaultLayout';
import TrackerWindow from '../components/Tracker/TrackerWindow';

// const drivers: IDriver[] = [{ id: '1', name: 'testasdasdassdaestasdasdassdaestasdasdassdaestasdasdassdaestasdasdassda' }];
// const nodes: INode[] = [{ id: '1', name: '111', lat: 12, lng: 100 }];

const TrackerPage: React.FC = () => {
  return (
    <DefaultLayout>
      <TrackerWindow></TrackerWindow>
    </DefaultLayout>
  );
};

export default TrackerPage;
