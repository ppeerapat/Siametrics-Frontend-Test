import { Collapse, Layout, message } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect } from 'react';
import { IDriver, IJob, INodes, IOrder, TargetOrder } from '../../interfaces/main';
import { getJobs, getJobsByDriver } from '../../services/TrackerData/jobs';
import { getNodes } from '../../services/TrackerData/nodes';
import TimelineCard, { PanelHeader } from './TimelineCard';
import JobCard from './JobCard';
import Map from './TrackerMap';
const { Content, Sider } = Layout;
const { Panel } = Collapse;

// interface TrackerWindowProp {
//   drivers: IDriver[];
//   current?: number;
//   nodes: INode[];
// }
interface Job extends IJob {
  isChecked?: boolean;
}

const TrackerWindow: React.FC = () => {
  const [drivers, setDrivers] = React.useState<IDriver[]>([]);
  const [nodes, setNodes] = React.useState<INodes>({});
  const [jobs, setJobs] = React.useState<Job[]>([]);

  const [selectedJobs, setSelectedJobs] = React.useState<Job[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<TargetOrder>();
  useEffect(() => {
    fetchNodes();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res);
    } catch (e) {
      message.error('There is an error loading the data');
    }
  };

  const fetchNodes = async () => {
    const res = await getNodes();
    setNodes(res);
  };

  const onSearchDriver = async (v: string) => {
    const res = await getJobsByDriver(v);
    setJobs(res);
  };

  React.useEffect(() => {
    setSelectedJobs(jobs.filter((e) => e.isChecked == true));
  }, [jobs]);

  // const loadRoute = (e: Job, index: number) => {
  //   const lnglat: LngLatLike[] = [];
  //   for (let i = 0; i < e.orders.length; i++) {
  //     const order = e.orders[i];
  //     const node = nodes[order.node];
  //     if (node) lnglat.push([node.lng, node.lat]);
  //   }
  //   getMatch(lnglat).then((r) => {
  //     const temp = [...jobs];
  //     e.route = r.routes[0].geometry;
  //     e.isChecked = !e.isChecked;
  //     temp[index] = e;
  //     setJobs(temp);
  //   });
  // };

  const handleOrderChange = (job: IJob, order: IOrder) => {
    const node = nodes[order.node];
    const targetOrder = {
      jobId: job.id,
      driver: job.driver.name,
      date: job.date,
      nodeName: node.name,
      lng: node.lng,
      lat: node.lat,
      ...order,
    };
    setSelectedOrder(targetOrder);
  };

  React.useEffect(() => {
    if (!selectedJobs.find((j) => j.id == selectedOrder?.jobId)) {
      setSelectedOrder(undefined);
    }
  }, [selectedJobs]);
  return (
    <Layout className="layout" style={{ width: '90vw', margin: 'auto' }}>
      <Sider width="260px" theme="light" breakpoint="lg" collapsedWidth="0" style={{ padding: '10px' }}>
        <Search onSearch={onSearchDriver} />
        <div style={{ border: 'solid 1px #d9d9d9', margin: '10px 0', height: '350px', overflowY: 'scroll' }}>
          {jobs.map((e, i) => {
            return (
              <div
                key={i + e.toString()}
                onClick={() => {
                  const temp = [...jobs];
                  e.isChecked = !e.isChecked;
                  temp[i] = e;
                  setJobs(temp);
                }}
              >
                <JobCard job={e} isActive={e.isChecked} />
              </div>
            );
          })}
        </div>
        <div style={{ margin: '10px 0', height: '450px', overflowY: 'scroll' }}>
          <Collapse
            accordion
            onChange={(e) => {
              const job = selectedJobs.find((j) => j.id == e);
              if (job) {
                handleOrderChange(job, job?.orders[0]);
              } else {
                setSelectedOrder(undefined);
              }
            }}
          >
            {selectedJobs.map((e, i) => {
              return (
                <Panel key={e.id} header={<PanelHeader job={e} />}>
                  <TimelineCard job={e} onChange={handleOrderChange} nodes={nodes} />
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </Sider>
      <Content>
        <Map jobs={selectedJobs ?? undefined} nodes={nodes} selectedOrder={selectedOrder} />
      </Content>
    </Layout>
  );
};

export default TrackerWindow;
