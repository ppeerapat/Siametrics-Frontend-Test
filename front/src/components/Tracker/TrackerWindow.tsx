import { Collapse, Layout, Timeline } from 'antd';
import Search from 'antd/lib/input/Search';
import { LngLatLike } from 'mapbox-gl';
import React, { useEffect } from 'react';
import { IDriver, INode, IJob } from '../../interfaces/main';
import { getMatch } from '../../services/Map';
import { getJobs, getJobsByDriver } from '../../services/TrackerData/jobs';
import { getNodes } from '../../services/TrackerData/nodes';
import JobCard from './JobCard';
import Map from './TrackerMap';
const { Content, Sider } = Layout;
const { Panel } = Collapse;

// interface TrackerWindowProp {
//   drivers: IDriver[];
//   current?: number;
//   nodes: INode[];
// }
interface Checker extends IJob {
  isChecked?: boolean;
}
const TrackerWindow: React.FC = () => {
  const [drivers, setDrivers] = React.useState<IDriver[]>([]);
  const [nodes, setNodes] = React.useState<INode[]>([]);
  const [jobs, setJobs] = React.useState<Checker[]>([]);
  const [selectedJobs, setSelectedJobs] = React.useState<Checker[]>([]);

  useEffect(() => {
    fetchNodes();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await getJobs();
    setJobs(res);
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
    console.log(jobs);
  }, [jobs]);

  const loadRoute = (e: Checker, index: number) => {
    const lnglat: LngLatLike[] = [];
    for (let i = 0; i < e.orders.length; i++) {
      const order = e.orders[i];
      const node = nodes.find((f) => f.id == order.node);
      if (node) lnglat.push([node.lng, node.lat]);
    }
    getMatch(lnglat).then((r) => {
      const temp = [...jobs];
      e.route = r.routes[0].geometry;
      temp[index] = e;
      setJobs(temp);
    });
  };
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
                  if (!e.route) {
                    loadRoute(e, i);
                  }
                }}
              >
                <JobCard job={e} isActive={e.isChecked} />
              </div>
            );
          })}
        </div>
        <div style={{ margin: '10px 0', height: '450px', overflowY: 'scroll' }}>
          <Collapse accordion>
            {selectedJobs.map((e, i) => {
              const total = e.orders.reduce((acc, v, i) => {
                return (acc += v.numberOfItem);
              }, 0);
              return (
                <Panel key={i + e.id} header={e.driver.name + ' Total items: ' + total}>
                  <p>Date: {e.date}</p>
                  <Timeline>
                    {e.orders.map((e, i) => {
                      return (
                        <Timeline.Item key={i + e.toString()}>
                          <p>
                            {e.time} Node: {e.node}
                          </p>{' '}
                          <p>No. of Items: {e.numberOfItem}</p>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </Sider>
      <Content>
        <Map jobs={selectedJobs} nodes={nodes} />
      </Content>
    </Layout>
  );
};

export default TrackerWindow;
