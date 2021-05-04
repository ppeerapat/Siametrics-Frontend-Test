import { Card } from 'antd';
import React from 'react';
import { IJob } from '../../interfaces/main';

interface JobCardProp {
  job: IJob;
  isActive?: boolean;
}

const JobCard: React.FC<JobCardProp> = ({ job, isActive }) => {
  // const [isSelected, setIsSelected] = React.useState(false);
  return (
    <Card style={{ overflow: 'hidden', backgroundColor: isActive ? '#ffbb96' : 'inherit', cursor: 'pointer' }}>
      <p>
        Job #{job.id} {job.date}
      </p>{' '}
      <p>Driver: {job.driver.name}</p>
    </Card>
  );
};
export default JobCard;
