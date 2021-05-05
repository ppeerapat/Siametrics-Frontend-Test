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
      <div style={{ display: 'flex' }}>
        Job #
        <p data-testid="job-id" style={{ margin: '0 5px' }}>
          {job.id}
        </p>{' '}
        {job.date}
      </div>{' '}
      <div style={{ display: 'flex' }}>
        Driver: <p data-testid="driver-name">{job.driver.name}</p>
      </div>
    </Card>
  );
};
export default JobCard;
