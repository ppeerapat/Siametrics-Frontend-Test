import { render } from '@testing-library/react';
import JobCard from '../components/Tracker/JobCard';
import { IJob, IDriver, IOrder } from '../interfaces/main';

describe('Test Render JobCard', () => {
  it('JobCard Props are correctly rendered', () => {
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
      date: new Date(),
    };
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('/' + job.id + '/i')).toBeTruthy();
    expect(getByText('/' + driver.name + '/i')).toBeTruthy();
  });
});
