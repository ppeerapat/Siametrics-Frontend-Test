import { cleanup, render } from '@testing-library/react';
import JobCard from '../components/Tracker/JobCard';
import { IJob, IDriver, IOrder, INodes } from '../interfaces/main';
import ReactDOM from 'react-dom';

import renderer from 'react-test-renderer';
import TimelineCard from '../components/Tracker/TimelineCard';

const driver: IDriver = {
  id: '1',
  name: 'test driver 1',
};
const order: IOrder = {
  id: '1',
  time: '10:00',
  node: '1',
  numberOfItem: 3,
};
const job: IJob = {
  id: '1',
  driver: driver,
  orders: [order],
  date: '2020-10-10',
};

afterEach(cleanup);
describe('Test Render JobCard', () => {
  it('Render JobCard without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<JobCard job={job} />, div);
  });
  it('JobCard Props are correctly rendered', () => {
    const { getByTestId } = render(<JobCard job={job} />);
    expect(getByTestId('job-id')).toHaveTextContent(job.id);
    expect(getByTestId('driver-name')).toHaveTextContent(driver.name);
  });
  it('JobCard matches snapshot', () => {
    const tree = renderer.create(<JobCard job={job} />).toJSON;
    expect(tree).toMatchSnapshot();
  });
});

describe('Test Render TimelineCard', () => {
  const nodes: INodes = { '1': { id: '1', name: 'test Node', lat: 13, lng: 100 } };
  it('Render TimelineCard without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TimelineCard job={job} />, div);
  });
  it('TimelineCard Props are correctly rendered', () => {
    const { getByTestId } = render(<TimelineCard job={job} />);
    expect(getByTestId('job-date')).toHaveTextContent(job.date);
    expect(getByTestId('job-fromtime')).toHaveTextContent(order.time);
    expect(getByTestId('job-totime')).toHaveTextContent(order.time);
    expect(getByTestId('job-totaltime')).toHaveTextContent('00hrs 00mins');
    // expect(getByTestId('job-orders')).toHaveLength(1);
  });
  it('TimelineCard matches snapshot', () => {
    const tree = renderer.create(<TimelineCard job={job} />).toJSON;
    expect(tree).toMatchSnapshot();
  });
});
