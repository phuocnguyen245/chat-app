import { Button } from 'antd';
import React from 'react';
interface props {
  channel?: any;
  onJoin?: any;
  key?: any;
}
const ChannelItem = ({ onJoin, channel, key }: props) => {
  return (
    <li>
      <div>
        <img src={channel?.data?.image} alt="" />
      </div>
      <div>
        <span>{channel?.data?.name}</span>
        <p>{channel?.data?.description || 'No description'} </p>
      </div>
      <Button onClick={() => onJoin(channel?.id)}>Join</Button>
    </li>
  );
};

export default ChannelItem;
