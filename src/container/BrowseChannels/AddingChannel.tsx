import React from 'react';
import { Tabs } from 'antd';
import BrowseChannels from '.';
import CreateChannel from './CreateChannel';

interface props {
  onClose: () => any;
  onSetChannel: (value: any) => void;
}
const AddingChannel = ({ onClose, onSetChannel }: props) => {
  const handleChangeTab = (key: string | number) => {};
  return (
    <Tabs defaultActiveKey="1" onChange={handleChangeTab}>
      <Tabs.TabPane tab="Browser" key="1">
        <BrowseChannels onClose={onClose} onSetChannel={onSetChannel} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Create" key="2">
        <CreateChannel onClose={onClose} onSetChannel={onSetChannel} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default AddingChannel;
