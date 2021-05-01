import { Card, Collapse, Layout, Timeline } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect } from 'react';
import { IDriver, INode, IJob } from '../../interfaces/main';
import api from '../../services/api';
import Map from './TrackerMap';
const { Content, Sider } = Layout;
const { Panel } = Collapse;

interface JobCardProp {
  job: IJob;
}

const JobCard: React.FC<JobCardProp> = ({ job }) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const onCardClick = () => {
    setIsSelected(!isSelected);
  };
  return (
    <Card style={{ overflow: 'hidden', backgroundColor: isSelected ? '#ffbb96' : 'inherit' }} onClick={onCardClick}>
      Job #{job.id} Driver: {job.driver.name}
    </Card>
  );
};

// interface TrackerWindowProp {
//   drivers: IDriver[];
//   current?: number;
//   nodes: INode[];
// }
const TrackerWindow: React.FC = () => {
  const [drivers, setDrivers] = React.useState<IDriver[]>([]);
  const [nodes, setNodes] = React.useState<INode[]>([]);
  const [jobs, setJobs] = React.useState<IJob[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number[]>([]);

  useEffect(() => {
    fetchNodes();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchNodes = async () => {
    try {
      const res = await api.get('/nodes');
      setNodes(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const searchDrivers = async (value: string) => {
    try {
      const res = await api.get('/jobs?driver.name_like=' + value);
      setJobs(res.data);
      setSelectedIndex([]);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    console.log(selectedIndex);
  }, [selectedIndex]);
  return (
    <Layout className="layout" style={{ width: '90vw', margin: 'auto' }}>
      <Sider width="260px" theme="light" breakpoint="lg" collapsedWidth="0" style={{ padding: '10px' }}>
        <Search
          onSearch={(v) => {
            searchDrivers(v);
          }}
        />
        <div style={{ border: 'solid 1px #d9d9d9', margin: '10px 0', height: '350px', overflowY: 'scroll' }}>
          {jobs.map((e, i) => {
            return (
              <div
                key={i + e.toString()}
                onClick={() => {
                  if (selectedIndex.indexOf(i) == -1) {
                    setSelectedIndex([...selectedIndex, i]);
                  } else {
                    setSelectedIndex(selectedIndex.filter((v) => v != i));
                  }
                }}
              >
                <JobCard job={e} />
              </div>
            );
          })}
        </div>
        <div style={{ margin: '10px 0', height: '450px', overflowY: 'scroll' }}>
          <Collapse accordion>
            {selectedIndex.map((e) => {
              const total = jobs[e].orders.reduce((acc, v, i) => {
                return (acc += v.numberOfItem);
              }, 0);
              return (
                <Panel key={e} header={jobs[e].driver.name + ' Total items: ' + total}>
                  <Timeline>
                    {jobs[e].orders.map((e, i) => {
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
      <Content style={{}}>
        <Map jobs={jobs} nodes={nodes} />
      </Content>
    </Layout>
  );
};

export default TrackerWindow;
