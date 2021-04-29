import React from 'react';
import DefaultLayout from '../components/common/DefaultLayout';
import TrackerWindow from '../components/Tracker/TrackerWindow';

const TrackerPage: React.FC = () => {
  return (
    <DefaultLayout>
      <TrackerWindow></TrackerWindow>
    </DefaultLayout>
  );
};

export default TrackerPage;
