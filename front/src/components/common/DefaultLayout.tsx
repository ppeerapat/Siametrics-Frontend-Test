import { Layout, Menu } from 'antd';
import React from 'react';

const { Content, Footer, Header } = Layout;

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item key="1">Driver Tracker</Menu.Item>
        </Menu>
      </Header>
      <Content>{children}</Content>
      <Footer></Footer>
    </Layout>
  );
};

export default DefaultLayout;
