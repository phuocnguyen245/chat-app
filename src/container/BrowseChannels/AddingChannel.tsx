import React from 'react';
import { Tabs } from 'antd';
import BrowseChannels from '.';
const AddingChannel = ({ onClose }: any) => {
  const handleChangeTab = (key: string | number) => {};
  return (
    <Tabs defaultActiveKey="1" onChange={handleChangeTab}>
      <Tabs.TabPane tab="Browser" key="1">
        <BrowseChannels onClose={onClose} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Create" key="2">
        {/* <AddingChannel /> */}
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 3" key="3">
        Content of Tab Pane 3
      </Tabs.TabPane>
    </Tabs>
  );
};

export default AddingChannel;
