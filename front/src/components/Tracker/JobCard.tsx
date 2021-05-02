import { Card } from 'antd';
import React, { useEffect } from 'react';
import { IJob } from '../../interfaces/main';

interface JobCardProp {
  job: IJob;
  isActive?: boolean;
}

const useForceUpdate = () => {
  const [value, setValue] = React.useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

const JobCard: React.FC<JobCardProp> = ({ job, isActive }) => {
  // const [isSelected, setIsSelected] = React.useState(false);
  const forceUpdate = useForceUpdate();
  return (
    <Card style={{ overflow: 'hidden', backgroundColor: isActive ? '#ffbb96' : 'inherit' }} onClick={forceUpdate}>
      <p>
        Job #{job.id} {job.date}
      </p>{' '}
      <p>Driver: {job.driver.name}</p>
    </Card>
  );
};
export default JobCard;
