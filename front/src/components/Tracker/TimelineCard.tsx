import { InboxOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import React from 'react';
import { IJob, INodes, IOrder } from '../../interfaces/main';

interface Prop {
  job: IJob;
  nodes?: INodes;
  onChange?: (j: IJob, o: IOrder) => void;
}

export const PanelHeader: React.FC<Prop> = ({ job }) => {
  const total = job.orders.reduce((acc, v, i) => {
    return (acc += v.numberOfItem);
  }, 0);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: '20px' }}>
      <p>
        #{job.id} {job.driver.name}
      </p>
      <div style={{ display: 'flex' }}>
        <p style={{ whiteSpace: 'nowrap' }}>{total}</p>
        <InboxOutlined style={{ fontSize: '20px', color: '#69c0ff', margin: '0 10px' }} />
      </div>
    </div>
  );
};

const TimelineCard: React.FC<Prop> = ({ job, nodes, onChange }) => {
  // const [isSelected, setIsSelected] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<IOrder>();
  React.useEffect(() => {
    if (selectedOrder && onChange) {
      onChange(job, selectedOrder);
    }
  }, [selectedOrder]);

  const fromTime = job.orders[0].time.split(':').map((e) => parseInt(e));
  const toTime = job.orders[job.orders.length - 1].time.split(':').map((e) => parseInt(e));
  const totalTime = [toTime[0] - fromTime[0], toTime[1] - fromTime[1]];

  return (
    <>
      <p>Date: {job.date}</p>
      <p>
        From {job.orders[0].time} to {job.orders[job.orders.length - 1].time}
      </p>
      <p>
        Total:{' '}
        {totalTime
          .map((e) =>
            e.toLocaleString('en-US', {
              minimumIntegerDigits: 2,
            })
          )
          .join('hrs ')}
        mins
      </p>
      <Timeline>
        {job.orders.map((e, i) => {
          return (
            <Timeline.Item key={i + e.toString()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setSelectedOrder({ ...e })}>
                <div>
                  <p>{e.time}</p>
                  <p>Node: {nodes?.[e.node].name}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <p style={{ whiteSpace: 'nowrap' }}>{e.numberOfItem}</p>
                  <InboxOutlined style={{ fontSize: '20px', color: '#69c0ff', margin: '0 10px' }} />
                </div>
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </>
  );
};
export default TimelineCard;
